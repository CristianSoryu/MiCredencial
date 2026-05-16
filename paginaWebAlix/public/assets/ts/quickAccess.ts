/**
 * Quick Access Cards Interactivity
 * Agrega efectos de hover y animaciones a los accesos rápidos
 */

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.accesos .card');
    
    cards.forEach(card => {
        // Efecto al pasar el mouse
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0px 5px 15px rgba(0, 0, 0, 0.1)';
            this.style.borderTopColor = '#c4001a';
            this.style.cursor = 'pointer';
        });
        
        // Efecto al salir el mouse
        card.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0px 5px 15px rgba(0, 0, 0, 0.1)';
            this.style.borderTopColor = 'transparent';
        });
        
        // Efecto de click (presión)
        card.addEventListener('mousedown', function(e) {
            this.style.transform = 'translateY(-6px)';
        });

        card.addEventListener('mouseup', function(e) {
            this.style.transform = 'translateY(-10px)';
        });
    });
});
