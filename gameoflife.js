class Board extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      speed : 10,
      genes : 8,
      size : 30,
      gameOn : false,
      game : null,
      cycles : 0
    }
  }
  
  deepCopy(arr){
    let newCopy = []
    arr.forEach((el,i)=>{
      if(Array.isArray(el)) 
        newCopy.push(this.deepCopy(el))
      else newCopy.push(el)
    })
    
    return newCopy
  }
  /* This one only copies one layer of array */
//   deepCopy(arr){
//     return arr.reduce((prev,cur)=>{
//       return prev.concat([cur])
//     }, [])
//   }
  
  startGame(){
    // Testing purposes
    // let start = new Date().getTime()
    // -----------------------
    let cycles = this.state.cycles
    let rows = this.deepCopy(this.state.tiles)
    let tiles = rows.slice()
    
    rows.forEach( (row, x) => {
      row.forEach( (el, y) => {
        let population = this.checkAdjacents(x,y)
        if(rows[x][y]){
          if(population > 3 || population < 2)
            tiles[x][y] = 0
        } else {
          if(population == 3) tiles[x][y] = 3
        }
      })
    })
    
    cycles += 1
    this.setState({ tiles, cycles })
    
    // For testing purposes
    // let end = new Date().getTime()
    // console.log(end-start)
  }
  
  checkAdjacents(x,y){
    let x2 = x == 0 ? 20 : x
    let y2 = y == 0 ? 20 : y
    let limit = this.state.size
    let sum = 0
    let newX, newY, truthy
    
    for(let i = 0; i < 3; i++){
      x2 = x == 0 ? 20 : x
      newY = (y2-1) % limit
      
      for(let j = 0; j < 3; j++){
        newX = (x2-1) % limit  
        // console.log(truthy)
        if(this.state.tiles[newX][newY] && (newX != x || newY != y)){
          // console.log(newX, newY, true)
          sum += 1
        } //else console.log(newX, newY, false)
        x2 += 1
        
      }
      y2 += 1
    }
    
    return sum
  }
  
  generateRandomBoard(){
    this.generateTiles()
    this.generateTilesRandomValues()
  }
  
  generateTilesRandomValues(){
    let {size, tiles, genes, cycles} = this.state
    
    for(let i = 0; i < (size * size) * genes/size + size ; i++){
      let rndX = Math.floor(Math.random() * size)
      let rndY = Math.floor(Math.random() * size)
      if(tiles[rndX][rndY]){
        i--
        continue
      }
      tiles[rndX][rndY] = 3
    }
    
    cycles = 0
    
    this.setState({ 
      tiles,
      cycles
    })
  }
  // TODO : Merge these 2 functions into 1
  generateTiles(){
    let {size} = this.state
    let tiles = []
    
    for(let i = 0; i < size; i++){
      let innerRow = []
      for(let j = 0; j < size; j++){
        innerRow.push(0)
      }
      tiles.push(innerRow)
    }
    
    // TODO : Fix this part later...
    // this.state.tiles = tiles.slice()
    this.setState({ tiles })
    // console.log(this)
  }
  
  toggleGame(){
    let {game, gameOn} = this.state
    
    if(gameOn){
      clearInterval(game)
      game = null
    } else {
      game = setInterval(this.startGame.bind(this),10/this.state.speed * 100)
    }
    
    gameOn = !gameOn
    
    this.setState({
      game, 
      gameOn
    })
  }
  
  toggleTile(x,y){
    let tiles = this.deepCopy(this.state.tiles)
    
    tiles[x][y] = tiles[x][y] ? 0 : 3
    
    this.setState({ tiles })
  }
  
  /* Inherited methods */
  componentWillMount(){
    this.generateTiles()
  }

  componentDidMount(){
    this.generateTilesRandomValues()
    this.toggleGame()    
  }
  
  render(){
    return (
      <div className='board'>
        {
          this.state.tiles.map( (arr, ind1) => {
            return (
              <div 
                key={ind1} 
                className='row'
                // onClick={this.toggleTile}
                >
              {
                arr.map( (el, ind2) => {
                  return <Tile
                           age={el}
                           key={`${ind1}x${ind2}`} 
                           toggle={this.toggleTile.bind(this)}
                           x={ind1}
                           y={ind2}
                           // onClick={this.toggleTile}
                           />
                })
              }
              </div>
            )
          })
        }
        <p>
          {
            this.state.cycles
          }
        </p>
        <input type='button' onClick={this.generateRandomBoard.bind(this)} value='Generate Random Board'/>
        <input type='button' onClick={this.generateTiles.bind(this)} value='Clear Board'/>
        <input type='button' onClick={this.toggleGame.bind(this)} value={(this.state.gameOn ? 'Stop' : 'Start') + ' Game'}/>
      </div>
    )
  }
}

class Tile extends React.Component {
  constructor(props){
    super(props)
    // console.log(this.props)
  }
  
  toggleTile(){
    let [x,y] = [
      this.props.x, 
      this.props.y
    ]
    this.props.toggle(x,y)
  }
  
  render(){
    return <div 
             onClick={this.toggleTile.bind(this)}
             className={`age-${this.props.age}`} 
             />
  }
}

ReactDOM.render(
  <Board />, document.getElementById('board')
)