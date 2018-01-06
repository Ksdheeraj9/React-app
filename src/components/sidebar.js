import {Component} from "react";
import { Sidebar, Dropdown,Input, Divider, Select, Grid, Contianer, Segment, Table, Checkbox, Button, Menu, Icon } from 'semantic-ui-react';
import { List } from 'semantic-ui-react';
import { Container, Header } from 'semantic-ui-react';
import {AppComponent} from './components/appComponent';
import 'semantic-ui-css/semantic.min.css';


const options = [{ key: 0, text: 'None', value: 0 },
                  { key: 1, text: 'Chord Daigram', value: 1 },
                  { key: 2, text: 'Pie Chart', value: 2 },
                  { key: 3, text: 'Heat Map', value: 3 },
                  { key: 4, text: 'Bar Chart', value: 4 }]

class Slidebar extends Component {

 constructor(props) {
    super(props);
    this.state = { visible: false};


    this.toggleVisibility = () => this.setState({ visible: !this.state.visible });
}
  
  render() {
    const { visible } = this.state
    return (
      <div>
       

       <Sidebar.Pushable as={Segment}>
          <div className="ui icon Button">
           <Button basic floated='right' icon onClick={this.toggleVisibility}><Icon name='align justify'/></Button> 
          </div>
          <Sidebar
            as={Menu}
            animation='overlay'
            width='very wide'
            direction='right'
            visible={visible}
            icon='labeled'
            vertical
          >
            <Segment>
              <div> 
              <Container textAlign='right'>
                 <Icon onClick={this.toggleVisibility} floated='right' >
                 <Icon name='close'
                       size='large'/>
                 </Icon>
              </Container>
              </div>              
              <br/>
              <div floated='right'>
                 <Dropdown  placeholder='Select Visualization' selection  options={options}  />
              </div>
              <br/>
              <Button primary  floated='left'size='small' onClick={this.toggleVisibility}  >Submit </Button>
              <Button positive floated='left' size='small'  >Reset</Button>
              <br/>
              <br/>
            </Segment>
          </Sidebar>
          <Sidebar.Pusher>
             <AppComponent/>
          </Sidebar.Pusher>
       </Sidebar.Pushable>
      </div>
    )

   





}

}
export default Slidebar;








