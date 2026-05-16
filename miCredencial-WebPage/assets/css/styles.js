import { stylesheet } from "react-native";

export const styles = stylesheet.create({
    body: {
        fontfamily: 'Segoe UI',
        background: linear-gradient(135, "#8b0000"," 0%","#b3001b", "100%"),
        margin: "0",
        padding: "0",
        display: flex,
        flexdirection: column,
        minheight: "100vh"
    },
    header: {
        background:" #000",
        color: "#fff",
        padding: "20px",
        width: "100%",
        textalign: "center",
        boxsizing: "border-box"
    },
    header_h1: { 
        margin: "0", 
        fontsize:"24px" 
    },
    header_p: { 
        color: "#c4001a", 
        fontweight: "bold", 
        margin: "5px"
    },
    
    contenedor: {
        width: "90%",
        maxwidth: "400px",
        background: "white",
        margin: "40px auto", /* Margen superior e inferior para despegarlo */
        borderradius: "15px",
    boxshadow: "0px 10px 25px rgba(0,0,0,0.4)",
    padding: "20px",
    textalign: "center"
}

/* --- 4. FORMULARIOS Y COMPONENTES --- */
input, select: {
    width: "100%", 
    padding: "12px",
    margin: "10px 0",
    borderradius: "8px",
    border: "1px solid #ccc",
    boxsizing: "border-box", 
    fontsize: "14px",
    transition: "0.3s"
},

input:focus, select:focus {
    outline: "none",
    bordercolor: "#c4001a",
    boxshadow: "0 0 5px rgba(196, 0, 26, 0.2)"
},

button: {
    width: "100%",
    padding: "14px",
    background: "#c4001a";
    color: "white";
    border: "none";
    borderradius: "8px";
    fontweight: "bold";
    fontsize: "16px",
    cursor: "pointer",
    margintop: "15px",
    transition: "0.3s",
}

button:hover {
    background: "#000"; /* Cambio a negro en hover para contraste */
}

/* --- 5. ENLACES Y NAVEGACIÓN --- */
.volver {
    display: inline-block;
    margin-top: "20px";
    color: "#666";
    text-decoration: "none";
    font-size: "14px";
    transition: "0.3s";
}

.volver:hover {
    color: "#c4001a"  ;
}

/* --- 6. UTILIDADES --- */
.escudo {
    width: 80px;
    height: auto;
    margin: 0 auto 15px;
    display: block;
}
});

export default styles;