async function name() {
    try {
    const informacion = await fetch("https://pokeapi.co/api/v2/pokemon/ditto")
    }catch (error) {
        console.log(error)
    }
}