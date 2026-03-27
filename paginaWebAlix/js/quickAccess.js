/**
 * Quick Access Cards Interactivity
 * Agrega efectos de hover y animaciones a los accesos rápidos
 */

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Efecto al pasar el mouse
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0px 12px 25px rgba(196, 0, 26, 0.2)';
            this.style.cursor = 'pointer';
        });
        
        // Efecto al salir el mouse
        card.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.08)';
        });
        
        // Efecto de click (presión)
        card.addEventListener('mousedown', function(e) {
            this.style.transform = 'translateY(-4px) scale(0.98)';
        });
        
        card.addEventListener('mouseup', function(e) {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
    });
});
