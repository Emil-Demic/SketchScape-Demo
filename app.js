// Configuration
const API_URL = 'https://emil-demic-sketchscape.hf.space/predict';
const CDN_URL = 'https://d2f5e6rx1vgqv1.cloudfront.net/CDN_images/';
const TOTAL_GALLERY_IMAGES = 3000;

// Pagination state
let allIndices = [];
let currentPage = 1;
const imagesPerPage = 20;

// Initial gallery pagination state
let galleryCurrentPage = 1;
const galleryImagesPerPage = 20;

// Canvas setup
const canvas = document.getElementById('sketchCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Initialize canvas with white background
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = 'black';
ctx.lineWidth = 3;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Drawing event handlers
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    lastX = (e.clientX - rect.left) * scaleX;
    lastY = (e.clientY - rect.top) * scaleY;
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    isDrawing = false;
}

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events for mobile support
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});

// Initialize gallery on page load
function initializeGallery() {
    renderGalleryPage();
    renderGalleryPagination();
}

function renderGalleryPage() {
    const gallery = document.getElementById('initialGallery');
    gallery.innerHTML = '';
    
    const startIndex = (galleryCurrentPage - 1) * galleryImagesPerPage;
    const endIndex = Math.min(startIndex + galleryImagesPerPage, TOTAL_GALLERY_IMAGES);
    
    for (let i = startIndex; i < endIndex; i++) {
        const imgUrl = `${CDN_URL}${i}.jpg`;
        
        const imgContainer = document.createElement('div');
        imgContainer.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = `Image ${i}`;
        img.loading = 'lazy';
        
        imgContainer.appendChild(img);
        gallery.appendChild(imgContainer);
    }
    
    // Update pagination info
    const paginationInfo = document.getElementById('galleryPaginationInfo');
    paginationInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${TOTAL_GALLERY_IMAGES} images`;
}

function renderGalleryPagination() {
    const pagination = document.getElementById('galleryPagination');
    
    // Save the page jump controls
    const pageJumpDiv = pagination.querySelector('.page-jump');
    
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(TOTAL_GALLERY_IMAGES / galleryImagesPerPage);
    
    if (totalPages <= 1) {
        // Still show page jump even if only one page
        if (pageJumpDiv) pagination.appendChild(pageJumpDiv);
        return;
    }
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '← Previous';
    prevBtn.disabled = galleryCurrentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (galleryCurrentPage > 1) {
            galleryCurrentPage--;
            renderGalleryPage();
            renderGalleryPagination();
            document.getElementById('gallerySection').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    });
    pagination.appendChild(prevBtn);
    
    // Page numbers
    const pageNumbersDiv = document.createElement('div');
    pageNumbersDiv.className = 'page-numbers';
    
    // Show first page, current page with surrounding pages, and last page
    let pagesToShow = [];
    
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pagesToShow.push(i);
        }
    } else {
        pagesToShow.push(1);
        
        if (galleryCurrentPage > 3) {
            pagesToShow.push('...');
        }
        
        for (let i = Math.max(2, galleryCurrentPage - 1); i <= Math.min(totalPages - 1, galleryCurrentPage + 1); i++) {
            pagesToShow.push(i);
        }
        
        if (galleryCurrentPage < totalPages - 2) {
            pagesToShow.push('...');
        }
        
        if (totalPages > 1) {
            pagesToShow.push(totalPages);
        }
    }
    
    pagesToShow.forEach(page => {
        if (page === '...') {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            pageNumbersDiv.appendChild(ellipsis);
        } else {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-number' + (page === galleryCurrentPage ? ' active' : '');
            pageBtn.textContent = page;
            pageBtn.addEventListener('click', () => {
                galleryCurrentPage = page;
                renderGalleryPage();
                renderGalleryPagination();
                document.getElementById('gallerySection').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            });
            pageNumbersDiv.appendChild(pageBtn);
        }
    });
    
    pagination.appendChild(pageNumbersDiv);
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = 'Next →';
    nextBtn.disabled = galleryCurrentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (galleryCurrentPage < totalPages) {
            galleryCurrentPage++;
            renderGalleryPage();
            renderGalleryPagination();
            document.getElementById('gallerySection').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    });
    pagination.appendChild(nextBtn);
    
    // Add page jump controls back
    if (pageJumpDiv) pagination.appendChild(pageJumpDiv);
}

// Initialize on page load
initializeGallery();

// Gallery page jump functionality
document.getElementById('galleryPageJumpBtn').addEventListener('click', () => {
    const input = document.getElementById('galleryPageJump');
    const pageNum = parseInt(input.value);
    const totalPages = Math.ceil(TOTAL_GALLERY_IMAGES / galleryImagesPerPage);
    
    if (pageNum && pageNum >= 1 && pageNum <= totalPages) {
        galleryCurrentPage = pageNum;
        renderGalleryPage();
        renderGalleryPagination();
        document.getElementById('gallerySection').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        input.value = '';
    } else {
        alert(`Please enter a page number between 1 and ${totalPages}`);
    }
});

// Allow Enter key to jump to page
document.getElementById('galleryPageJump').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('galleryPageJumpBtn').click();
    }
});

// Clear canvas
document.getElementById('clearBtn').addEventListener('click', function() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    
    // Hide results and show gallery section when canvas is cleared
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('gallerySection').style.display = 'block';
});

// Function to check if canvas is empty
function isCanvasEmpty() {
    const canvas = document.getElementById('sketchCanvas');
    const ctx = canvas.getContext('2d');
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    // Check if all pixels are transparent/white
    for (let i = 0; i < pixelData.length; i += 4) {
        if (pixelData[i + 3] !== 0) { // Check alpha channel
            return false;
        }
    }
    return true;
}

// Submit sketch
document.getElementById('submitBtn').addEventListener('click', async function() {
    // Get base64 image from canvas
    const base64Image = canvas.toDataURL('image/jpeg');
    
    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    
    // Hide gallery section when showing results
    document.getElementById('gallerySection').style.display = 'none';
    
    try {
        // Send to API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64Image
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API response:', result);
        
        // Extract indices from response
        // The API returns data in the format: {data: [[index1, index2, ...]]}
        const indices = result;
        
        // Display results
        displayResults(indices);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to retrieve images. Please try again.');
    } finally {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
    }
});

// Display retrieved images with pagination
function displayResults(indices) {
    allIndices = indices;
    currentPage = 1;
    renderPage();
    renderPagination();
    
    // Set up page jump for results (only needs to be done once)
    const resultsJumpBtn = document.getElementById('resultsPageJumpBtn');
    if (resultsJumpBtn && !resultsJumpBtn.hasAttribute('data-initialized')) {
        resultsJumpBtn.setAttribute('data-initialized', 'true');
        
        resultsJumpBtn.addEventListener('click', () => {
            const input = document.getElementById('resultsPageJump');
            const pageNum = parseInt(input.value);
            const totalPages = Math.ceil(allIndices.length / imagesPerPage);
            
            if (pageNum && pageNum >= 1 && pageNum <= totalPages) {
                currentPage = pageNum;
                renderPage();
                renderPagination();
                document.getElementById('resultsSection').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                input.value = '';
            } else {
                alert(`Please enter a page number between 1 and ${totalPages}`);
            }
        });
        
        document.getElementById('resultsPageJump').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                resultsJumpBtn.click();
            }
        });
    }
    
    document.getElementById('resultsSection').style.display = 'block';
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function renderPage() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = Math.min(startIndex + imagesPerPage, allIndices.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const index = allIndices[i];
        const imgUrl = `${CDN_URL}${index}.jpg`;
        
        const imgContainer = document.createElement('div');
        imgContainer.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = `Result ${i + 1}`;
        img.loading = 'lazy';
        
        const rank = document.createElement('div');
        rank.className = 'rank';
        rank.textContent = i + 1;
        
        imgContainer.appendChild(img);
        imgContainer.appendChild(rank);
        gallery.appendChild(imgContainer);
    }
    
    // Update pagination info
    const paginationInfo = document.getElementById('paginationInfo');
    paginationInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${allIndices.length} results`;
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    
    // Save the page jump controls
    const pageJumpDiv = pagination.querySelector('.page-jump');
    
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(allIndices.length / imagesPerPage);
    
    if (totalPages <= 1) {
        // Still show page jump even if only one page
        if (pageJumpDiv) pagination.appendChild(pageJumpDiv);
        return;
    }
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '← Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
            renderPagination();
            document.getElementById('resultsSection').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    });
    pagination.appendChild(prevBtn);
    
    // Page numbers
    const pageNumbersDiv = document.createElement('div');
    pageNumbersDiv.className = 'page-numbers';
    
    // Show first page, current page with surrounding pages, and last page
    let pagesToShow = [];
    
    if (totalPages <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= totalPages; i++) {
            pagesToShow.push(i);
        }
    } else {
        // Always show first page
        pagesToShow.push(1);
        
        // Show pages around current page
        if (currentPage > 3) {
            pagesToShow.push('...');
        }
        
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pagesToShow.push(i);
        }
        
        if (currentPage < totalPages - 2) {
            pagesToShow.push('...');
        }
        
        // Always show last page
        if (totalPages > 1) {
            pagesToShow.push(totalPages);
        }
    }
    
    pagesToShow.forEach(page => {
        if (page === '...') {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            pageNumbersDiv.appendChild(ellipsis);
        } else {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-number' + (page === currentPage ? ' active' : '');
            pageBtn.textContent = page;
            pageBtn.addEventListener('click', () => {
                currentPage = page;
                renderPage();
                renderPagination();
                document.getElementById('resultsSection').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            });
            pageNumbersDiv.appendChild(pageBtn);
        }
    });
    
    pagination.appendChild(pageNumbersDiv);
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = 'Next →';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
            renderPagination();
            document.getElementById('resultsSection').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    });
    pagination.appendChild(nextBtn);
    
    // Add page jump controls back
    if (pageJumpDiv) pagination.appendChild(pageJumpDiv);
}

// Modal functionality
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.querySelector('.modal-close');

// Function to open modal with image
function openImageModal(imageSrc, imageAlt) {
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    modalCaption.innerHTML = imageAlt || '';
}

// Close modal when clicking the X
modalClose.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Close modal when clicking outside the image
modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});

// Add click handlers to gallery images (delegate to handle dynamically added images)
document.getElementById('initialGallery').addEventListener('click', function(event) {
    if (event.target.tagName === 'IMG') {
        openImageModal(event.target.src, event.target.alt);
    }
});

document.getElementById('gallery').addEventListener('click', function(event) {
    if (event.target.tagName === 'IMG') {
        openImageModal(event.target.src, event.target.alt);
    }
});
