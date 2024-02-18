import {Component} from "react"
import './App.css';
import {ResponsiveContainer,BarChart,Bar,XAxis,YAxis,Tooltip} from "recharts";


class App extends Component{
  state={products:[],barData:[],stats:{},desiredMonth:"3",offsetValue:0,searchInput:""}

  componentDidMount(){
    this.getProductsApi()
  }

  getProductsApi=async()=>{
    const {desiredMonth,offsetValue,searchInput}=this.state
    const response=await fetch(`https://vast-jade-mackerel-yoke.cyclic.app/?searchq=${searchInput}&month=${desiredMonth}&limit=10&offset=${offsetValue}`)
    const response2=await fetch(`https://vast-jade-mackerel-yoke.cyclic.app/bar-chart?month=${desiredMonth}`)
    const response3=await fetch(`https://vast-jade-mackerel-yoke.cyclic.app/statistics?month=${desiredMonth}`)
    if(response.ok===true){
      const data=await response.json()
      this.setState({products:data})
    }
    else{
      this.setState({products:[]})
      console.log("something went wrong")
    }
    if(response2.ok===true){
      const data2=await response2.json()
      this.setState({barData:data2.data})
    }
    else{
      this.setState({products:[]})
      console.log("something went wrong")
    }
    if(response3.ok===true){
      const data3=await response3.json()
      const updatedData={
        totalSale:data3["SUM(price)"],
        noOfItemsSold:data3["COUNT(sold)"]
      }
      this.setState({stats:updatedData})
    }
  }

  onDropDownChange=(event)=>{
    this.setState({desiredMonth:event.target.value},this.getProductsApi)
  }

  onNextClick=()=>{
    this.setState((prevState)=>({offsetValue:prevState.offsetValue+10
    }),this.getProductsApi)
  }

  onPreviousClick=()=>{
    this.setState((prevState)=>({offsetValue:prevState.offsetValue-10}),this.getProductsApi)
  }

  onInputChange=(event)=>{
    this.setState({searchInput:event.target.value},this.getProductsApi)
  }

  render(){
    const{products,searchInput,barData,stats}=this.state
    const{totalSale,noOfItemsSold}=stats
    console.log(products)
    return(
      <div className="bg-container">
        <h1 className="heading">Transaction Dashboard</h1>
        <div className="dropdown">
          <input value={searchInput} onChange={this.onInputChange} placeholder="Search"/>
          <select onChange={this.onDropDownChange}>
            <option value="1">Jan</option>
            <option value="2">Feb</option>
            <option value="3" selected>Mar</option>
            <option value="4">Apr</option>
            <option value="5">May</option>
            <option value="6">Jun</option>
            <option value="7">Jul</option>
            <option value="8">Aug</option>
            <option value="9">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </select>
        </div>
        <table>
          <thead>
          <tr>
            <th>id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
          </thead>
          <tbody>
          {
             products.map((eachItem)=>(
              <tr>
                <td>{eachItem.id}</td>
                <td>{eachItem.title}</td>
                <td>{eachItem.description}</td>
                <td>{eachItem.price}</td>
                <td>{eachItem.category}</td>
                <td>{eachItem.sold ? "No" : "Yes"}</td>
                <td><img src={eachItem.image} alt="product" className="product-image"/></td>
              </tr>
             ))
          }
          </tbody>
        </table>
        <div className="button-container">
          <button type="button" onClick={this.onPreviousClick}>Previous</button>
          <button type="button" onClick={this.onNextClick}>Next</button>
        </div>
          <div className="stat-container">
          <h1 className="stat-heading">statistics</h1>
            <p>Total Sale: {totalSale}</p>
            <p>Total Sold Item: {noOfItemsSold}</p>
          </div>
        <h1>Bar Chart</h1>
        <ResponsiveContainer width="50%" aspect={3}>
          <BarChart data={barData} width={600} height={500}>
            <XAxis dataKey="name"/>
            <Tooltip/>
            <YAxis/>
            <Bar dataKey="no_of_items" fill="#1ac6ff"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

export default App;
