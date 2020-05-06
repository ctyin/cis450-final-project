import React, { Component } from 'react';
import NavBar from '../NavBar';
import '../../search_page.css';
import SelectBox from '../SelectBox';

class StatsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {category: 'model',
     subcategory: null,
     content: [],
     loading: true
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
            //   <div key={`${result.rows[i][0]}--make-div`}>
            //     <div
            //       key={`make-id-${result.rows[i][0]}`}
            //       data-id={result.rows[i][0]}
            //       onClick={this.selectItem}
            //       className="items-box--item"
            //     >
            //       {result.rows[i][1]}
            //     </div>
            //     <div
            //       key={`${result.rows[i][0]}--sep-make`}
            //       className="items-box--seperater"
            //     ></div>
            //   </div>
            
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
            content: result.rows,
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
            content: result.rows,
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

      let content = this.state.content.map((row, index) => {
        return (
          <div>
          <div className="info-box--flex" key={`year--data${index}`}>
            <div className="info-box"> {row[0]} </div>
            <div className="info-box"> {row[1]} </div>
            <div className="info-box"> {row[2]} </div>
          </div>
          <div className="row-separator"></div>
          </div>
        )
      })

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

      {this.state.loading ? ('') :
       (
       <div className="info-area">
         <div className="info-box--flex" >
            <div className="info-box"> <h2>Make</h2></div>
            <div className="info-box"> <h2>Model</h2> </div>
            <div className="info-box"> <h2>MPG (Highway)</h2> </div>
          </div>
         {content}
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