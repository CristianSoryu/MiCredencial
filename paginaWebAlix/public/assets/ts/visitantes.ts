document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carreras');
    const prevButton = document.getElementById('carreras-prev');
    const nextButton = document.getElementById('carreras-next');

    if (!track || !prevButton || !nextButton) {
        return;
    }

    const originalCards = Array.from(track.children);
    let currentIndex = 0;
    let clonesPerSide = 0;
    let isTransitioning = false;

    function getCardsPerView() {
        if (window.innerWidth <= 640) {
            return 1;
        }

        if (window.innerWidth <= 900) {
            return 2;
        }

        return 3;
    }

    function getStepSize() {
        const firstCard = track.querySelector('.card');

        if (!firstCard) {
            return 0;
        }

        const trackStyles = window.getComputedStyle(track);
        const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0');
        return firstCard.offsetWidth + gap;
    }

    function setTrackPosition(index, withTransition = true) {
        const stepSize = getStepSize();

        if (!stepSize) {
            return;
        }

        track.style.transition = withTransition ? 'transform 0.35s ease' : 'none';
        track.style.transform = `translateX(-${stepSize * index}px)`;
    }

    function rebuildClones() {
        track.innerHTML = '';
        clonesPerSide = getCardsPerView();

        const leadingClones = originalCards
            .slice(-clonesPerSide)
            .map((card) => card.cloneNode(true));

        const trailingClones = originalCards
            .slice(0, clonesPerSide)
            .map((card) => card.cloneNode(true));

        leadingClones.forEach((card) => track.appendChild(card));
        originalCards.forEach((card) => track.appendChild(card));
        trailingClones.forEach((card) => track.appendChild(card));

        currentIndex = clonesPerSide;
        setTrackPosition(currentIndex, false);
    }

    function moveTo(index) {
        if (isTransitioning) {
            return;
        }

        isTransitioning = true;
        currentIndex = index;
        setTrackPosition(currentIndex, true);
    }

    prevButton.addEventListener('click', () => {
        moveTo(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        moveTo(currentIndex + 1);
    });

    track.addEventListener('transitionend', () => {
        const totalOriginal = originalCards.length;

        if (currentIndex < clonesPerSide) {
            currentIndex = totalOriginal + currentIndex;
            setTrackPosition(currentIndex, false);
        } else if (currentIndex >= totalOriginal + clonesPerSide) {
            currentIndex = currentIndex - totalOriginal;
            setTrackPosition(currentIndex, false);
        }

        // Fuerza el reflow para que la siguiente animacion siga siendo suave.
        track.offsetHeight;
        track.style.transition = 'transform 0.35s ease';
        isTransitioning = false;
    });

    window.addEventListener('resize', () => {
        rebuildClones();
    });

    rebuildClones();
});
