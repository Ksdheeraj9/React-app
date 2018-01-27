import {Component} from "react";
import {ChordComponent} from "./chordComponent";
import d3 from "d3";
import $ from "jquery";

export class AppComponent extends Component{
  constructor(props){
    super(props);
    this.state = {
      master        : {},
      selected_year : "2005",
      years         : d3.range(2005, 1865, -5),
      filters       : {},
      hasFilters    : false,
      tooltip       : {},
      pFormat       : d3.format(".1%"),
      qFormat       : d3.format(",.0f")
  };

    this.importJSON      = this.importJSON.bind(this);
    this.addFilter      = this.addFilter.bind(this);
    this.update         = this.update.bind(this);
    this.updateTooltip  = this.updateTooltip.bind(this);
    this.clear          = this.clear.bind(this);
    this.selectYear     = this.selectYear.bind(this);
    this.setFilters     = this.setFilters.bind(this);
  }

  updateTooltip = (data) => {
    this.setState({
      tooltip: data
    });
  };

  addFilter = (name) => {
    let filters = this.state.filters;
    filters[name] = {
      name  : name,
      hide  : true
    };
    this.setState({
      hasFilters : true,
      filters : filters
    });
    this.update()
  };

  update = (state) => {
    state = state ? state : this.state;
    let data  = state.master[state.selected_year];

    if (data && state.hasFilters) {
      this.child.drawChords(data.filter(function (d) {
        let fl = state.filters;
        let v1 = d.importer1 , v2 = d.importer2;

        if ((fl[v1] && fl[v1].hide) || (fl[v2] && fl[v2].hide)) {
          return false;
        }
        return true;
      }));
    } else if (data) {
      this.child.drawChords(data);
    }
  };

  importJSON() {
    let state = this.state;
    let _this = this;
    d3.json('https://api.myjson.com/bins/sn97t', function (err, data) {
      data.forEach(function (d) {
        d.year  = +d.year;
        d.flow1 = +d.flow1;
        d.flow2 = +d.flow2;
        if (!state.master[d.year]) {
          state.master[d.year] = []; // STORED BY YEAR
        }
        state.master[d.year].push(d);
      });
      _this.setState({
        master: state.master
      });
      _this.update(state);
    });
  };
  setFilters(item, input){
    let state = this.state;
    state.filters[item.name] = {
        name: item.name,
        hide: input.target.checked
    }
    this.setState({
      filters : state.filters
    });
    this.update(state);
  }

  selectYear(e){
    let state = this.state;
    state.selected_year = e.target.selected;
    this.setState({
      selected_year: state.selected_year
    });
    this.update(state);
  }

  clear(){
    let state = this.state;
    if(Object.keys(state.filters).length > 0 && state.hasFilters) {
        state.filters = {};
        state.hasFilters = false;
        this.setState({
            filters: {},
            hasFilters: false
        });
        this.update(state);
    }
  }

  componentDidMount(){
    this.setState({
      isComponentMount: true
    });
    this.importJSON();
    $("#year_2005").trigger("click");
  }

  render(){
    let state = this.state;
    return(
        <div>
        <div className="row" style={{position:"relative"}}>

          <aside className="large-2 small-2 columns panel years">
           <h5>Years</h5>
            <ul className="side-nav">
              {state.years.map((year, index) =>
                <li key={index} >
                  <input value={state.selected_year} type="radio" selected={year}
                   name="years" id={`year_${ year }`} onClick={this.selectYear} />
                  <label htmlFor={`year_${ year }`} >{year}</label>
                </li>
              )}
           </ul>
          </aside>
          <div className="large-7 small-6 columns" role="content">
            <article id="chord">
              {
                state.isComponentMount ?
                  <ChordComponent updateTooltip={this.updateTooltip}
                                  addFilter={this.addFilter} onRef={ref => (this.child = ref)}
                                  filters={state.filters}>
                  </ChordComponent>
                  : null
              }
            </article>
              <h6 className="text-center"> Trade Flow for the year: <span>{state.selected_year}</span></h6>
          </div>
           <aside className="large-3 small-4 columns">
          <h5>Filters</h5>
        <button className="button tiny right"
                onClick={this.clear}>
        clear
        </button>
          <div className="panel">
              {!state.hasFilters &&
              <div style={{margin: "15px" , opacity: 0.5}}>
                  Click a country name
              </div>}

              <ul className="side-nav">
                  {Object.keys(state.filters).map((filter, index) =>
                      <li key={state.filters[filter].name} >
                          <input type="checkbox" id={ state.filters[filter].name }
                                   checked={state.filters[filter].hide} onClick={(input) => this.setFilters(state.filters[filter] , input)} />
                          <label htmlFor={ state.filters[filter].name }>{filter}</label>
                      </li>
                  )}
              </ul>
          </div>
      </aside>

    

      <fieldset id="tooltip" className="row secondary">
          <div className="large-12 small-12 columns">
          <h6>{state.tooltip.sname} imported from  {state.tooltip.tname} : $ { state.qFormat(state.tooltip.svalue) }M</h6>
      { state.pFormat(state.tooltip.svalue/state.tooltip.stotal) } of { state.tooltip.sname }s Total ($ { state.qFormat(state.tooltip.stotal) }M)
      { state.pFormat(state.tooltip.svalue/state.tooltip.mtotal) } of Total of $ { state.qFormat(state.tooltip.mtotal) }M
      </div>
      <div className="large-12 small-12 columns">
          <h6>{ state.tooltip.tname } imported from  { state.tooltip.sname } : $ { state.qFormat(state.tooltip.tvalue) }M</h6>
          { state.pFormat(state.tooltip.tvalue/state.tooltip.ttotal) } of { state.tooltip.tname }s Total ($ { state.qFormat(state.tooltip.ttotal) }M)
          { state.pFormat(state.tooltip.tvalue/state.tooltip.mtotal) } of Total of $ { state.qFormat(state.tooltip.mtotal) }M
      </div>
      </fieldset>

  </div>

     
        </div>
    );
  }

}
