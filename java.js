// gallery-loader.js
// This script:
// 1. Preloads all images as soon as the main page loads
// 2. Lets users open images in a fullscreen viewer
// 3. Allows scrolling/navigation through all images

document.addEventListener('DOMContentLoaded', () => {
	// Get all images on the page
	const images = Array.from(document.querySelectorAll('img'));

	// =========================
	// PRELOAD IMAGES
	// =========================
	images.forEach((img) => {
		const preload = new Image();
		preload.src = img.src;
	});

	// =========================
	// CREATE FULLSCREEN VIEWER
	// =========================
	const viewer = document.createElement('div');
	viewer.id = 'imageViewer';

	viewer.innerHTML = `
        <span id="closeViewer">&times;</span>
        <img id="viewerImage" src="">
        <button id="prevBtn">&#10094;</button>
        <button id="nextBtn">&#10095;</button>
    `;

	document.body.appendChild(viewer);

	// =========================
	// STYLES
	// =========================
	const style = document.createElement('style');
	style.innerHTML = `
        #imageViewer {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }

        #viewerImage {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }

        #closeViewer {
            position: absolute;
            top: 20px;
            right: 30px;
            background: transparent;
            color: gray;
            font-size: 40px;
            cursor: pointer;
        }

        #prevBtn,
        #nextBtn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 40px;
            padding: 10px 20px;
            cursor: pointer;
        }

        #prevBtn {
            left: 20px;
        }

        #nextBtn {
            right: 20px;
        }
    `;
	document.head.appendChild(style);

	// =========================
	// VIEWER LOGIC
	// =========================
	const viewerImage = document.getElementById('viewerImage');
	const closeViewer = document.getElementById('closeViewer');
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');

	let currentIndex = 0;

	function openViewer(index) {
		currentIndex = index;
		viewer.style.display = 'flex';
		viewerImage.src = images[currentIndex].src;
	}

	function showNext() {
		currentIndex = (currentIndex + 1) % images.length;
		viewerImage.src = images[currentIndex].src;
	}

	function showPrev() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
		viewerImage.src = images[currentIndex].src;
	}

	// Open image on click
	images.forEach((img, index) => {
		img.style.cursor = 'pointer';

		img.addEventListener('click', () => {
			openViewer(index);
		});
	});

	// Buttons
	nextBtn.addEventListener('click', showNext);
	prevBtn.addEventListener('click', showPrev);

	// Close viewer
	closeViewer.addEventListener('click', () => {
		viewer.style.display = 'none';
	});

	// Keyboard navigation
	document.addEventListener('keydown', (e) => {
		if (viewer.style.display !== 'flex') return;

		if (e.key === 'ArrowRight') showNext();
		if (e.key === 'ArrowLeft') showPrev();
		if (e.key === 'Escape') viewer.style.display = 'none';
	});
	// Close when clicking background only
	viewer.addEventListener('click', function (e) {
		// If clicked directly on the dark background
		if (e.target === viewer) {
			viewer.style.display = 'none';
		}
	});
	// Mouse wheel scroll navigation
	viewer.addEventListener('wheel', (e) => {
		e.preventDefault();

		if (e.deltaY > 0) {
			showNext();
		} else {
			showPrev();
		}
	});
});
