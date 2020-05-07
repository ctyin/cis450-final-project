import React, { Component } from 'react';
import NavBar from '../NavBar';
import '../../search_page.css';
import SelectBox from '../SelectBox';
import CanvasJSReact from './canvasjs.react';
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class StatsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {category: 'model',
     subcategory: null,
     content: [],
     loading: true,
     datapoints: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSub = this.handleChangeSub.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
      let y = event.target.value;
    if (event.target.value === 'make') { 
        let newMakes = [];
      fetch('http://localhost:8081/allmakes')
        .then((res) => res.json())
        .then((result) => {
          for (let i = 0; i < result.rows.length; i++) {
            newMakes.push(
                <option key={`${result.rows[i][0]}--make-div`} value={result.rows[i][1]}>{result.rows[i][1]}</option>
            );
          }
          this.setState({
            category: y,
            subcategory: newMakes,
          });
        })
        .catch((err) => {
          console.log(err);
        });
        // this.setState({category: event.target.value, subcategory: ['a', 'b', 'c']});
    } else if (event.target.value === 'year') {
        let newYears = [];
        for (let i = 1985; i < 2022; i++) {
            newYears.push(
                <option key={i} value={i}>{i}</option>
            );
    } 
    this.setState({category: event.target.value, subcategory: newYears});   
  }
}

  handleChangeSub(event) {
    let x =  <option>{event.target.value}</option>

    this.setState({subcategory: x});
    // alert(event.target.value);   
  }

  handleSubmit(event) {
    // alert('Your favorite flavor is: ' + this.state.value);
    if (this.state.category === 'make') {
      let make = this.state.subcategory;

      
      fetch(`http://localhost:8081/stats/getStatsMake/${make.props.children}`)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            datapoints: result.rows,
            loading: false
          })
        });
    }

    if (this.state.category === 'year') {
      let year = this.state.subcategory;

      
      fetch(`http://localhost:8081/stats/getStatsYear/${year.props.children}`)
        .then((res) => res.json())
        .then((result) => {

          this.setState({
            datapoints: result.rows,
            loading: false
          })
        });
    }
    event.preventDefault();
  }

  

// tried to make a second handler but doesnt compile rip
//   handleChange2(event) {
//     this.setState({subcategory: event.target.value});    
//   }

  render() {
      let x = this.state.subcategory !== null ? ( 
           this.state.subcategory

        ):''

        
          //        <div>
          //   <CanvasJSChart options = {options}
          //       /* onRef = {ref => this.chart = ref} */
          //   />
          // </div>
        

        
        
      let datapoints = this.state.datapoints.map((row, index) => {
        
        return (
          { label: row[0] + ' ' + row[1],  y: row[2]  }
        )
        
      })

      console.log(datapoints)

      let options = {
        title: {
          text: "Top 10 Most Efficient Vehicles (MPG vs Make, Model)"
        },
        data: [{				
                  type: "column",
                  dataPoints: datapoints,
         }]
     }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
        <label>
          Pick a category:
          <select value={this.state.category} onChange={this.handleChange}>
            <option value=""></option>
            <option value="make">Make</option>
            <option value="year">Year</option>
          </select>
        </label>
        <div className = "row-spacer"/>

        


{/* the second dropdown changes the value in the first one for some reason... */}
        <label>
          Pick a sub-category:
          <select value='subcategory' onChange={this.handleChangeSub}>
          {x}
          </select>
        </label>
        <input type="submit" value="Submit" />

      </form>
      <div className="row-spacer"></div>

      {this.state.loading ? ('') :
       (
       <div>
         {/* <div className="info-box--flex" >
            <div className="info-box"> <h2>Make</h2></div>
            <div className="info-box"> <h2>Model</h2> </div>
            <div className="info-box"> <h2>MPG (Highway)</h2> </div>
          </div> */}
         <CanvasJSChart options = {options}/>
         </div>
       )}

      </div>
    );
  }
}

// class StatsForm extends Component {
//     constructor(props) {
//       super(props);
  
//       this.state = {category: 'make', subcategory: null};

//           this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
  
//     }
  
//     componentDidUpdate(prevProps, prevState) {
//       // update state for items
//       if (this.state.category !== prevState.category) {
//         this.setState({subcategory: null });
//         alert('Changed to: ' + this.state.category);

//       }
//     }
  

  
  
//     handleSubmit = (e) => {
//       e.preventDefault();
      
//     };

//       handleChange(event) {
//     this.setState({category: event.target.value}); 
//         alert('change ' + this.state.category);
//   }

//   handleSubmit(event) {
//     // alert('Your favorite flavor is: ' + this.state.value);
//     if (this.state.category == 'model') { 
//         alert('triggering true'); 
//     }
//     event.preventDefault();
//   }

  
//     render() {
    
  
//       return (
//         <div className="container">
//           <form action="get" role="search" onSubmit={this.handleSubmit}>
//             <div className="search-wrapper">
//               <div className="search-inputs">
//                 <div className="search-input">
//                   <div className="select-form">
//                   <select value={this.state.category} onChange={this.handleChange}>
//                   <option value="make">Make</option>
//                   <option value="year">Year</option>
//                   </select>
//                   </div>
//                 </div>
//                 <div className="separater"></div>
//                 <div className="search-input">
//                   <div className="select-form">
//                   <select value={this.state.subcategory} onChange={this.handleChange}>
//                   <option value="model">Model</option>
//                   <option value="make">Make</option>
//                   <option value="year">Year</option>
//                   </select>
//                   </div>
//                 </div>
//                 </div>
//                 </div>
//           </form>
//         </div>
//       );
//     }
//   }

 export default StatsForm;