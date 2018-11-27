import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

class EnglishText extends React.Component{
  render() {
    return(
      <div className="EnglishWrapper">
        <textarea className="EnglishText" onChange={ this.props.handleChange } onKeyPress={this.props.handleKeyPress } value={this.props.text} maxLength="36"></textarea>
      </div>
    )
  }
}

class ResponseText extends React.Component{

  
  constructor(){
    super();

    this.letter_counter = 0;

    this.state = {
      letters_map: {},
      glyph_lines : [],
      last_line_width : 0,
      text: ''
    };
  }

  componentDidMount() {
    this.width = ReactDOM.findDOMNode(this).parentNode.offsetWidth;
  }


  render() {

    let letters = this.props.paths;
    let glyph_lines = [];
    let line_width = 0;
    let line_num = 0;
    
    letters.forEach( (letter, ix) => {
      if(letter && typeof letter !== 'undefined'){
        line_width += letter.width;

        if (line_width >= this.width) {
          line_width = letter.width;
          line_num++;
        }

        if(typeof glyph_lines[line_num] === 'undefined'){
          glyph_lines[line_num] = [];
        }
        
        glyph_lines[line_num].push(letter);
      }
    });

    return (
      <div>
        {
          glyph_lines.map( (line, ix) => {
            return <GlyphLine key={ix} line_num={ix} glyph_line={line} />
          })
        }
      </div>
    )
  }
}

class GlyphText extends React.Component{

  
  constructor(){
    super();

    this.letter_counter = 0;

    this.state = {
      letters_map: {},
      glyph_lines : [],
      last_line_width : 0,
      text: ''
    };
  }

  componentDidMount() {
    this.width = ReactDOM.findDOMNode(this).parentNode.offsetWidth;
  }

  
  componentDidUpdate() {

    if(this.state.text !== this.props.text){

      this.setState({text : this.props.text});

      let letters = this.props.text.toUpperCase().split('');
      
      letters.forEach( (letter, ix) => {
        
        if( typeof this.state.letters_map[ix] === 'undefined' || 
        this.state.letters_map[ix].letter !== letter){

              fetch('http://1bc29b36f623ba82aaf6724fd3b16718.com/api/path.php', {
                method: "POST",
                body: JSON.stringify({chr: letter})
              })
                .then( function( response )  { return response.json(); })
                .then( ( r ) => { 
                  if(r){
                    let lm = this.state.letters_map;
                    r.letter = letter;
                    lm[ix] = r;
                    this.setState({letters_map : lm})
                  }
              })
              .catch(( error ) => { console.error(error); });
            }
      });
    }
  } 

  render() {

    let letters = this.props.text.toUpperCase().split('');
    let glyph_lines = [];
    let line_width = 0;
    let line_num = 0;
    
    letters.forEach( (letter, ix) => {
      if(typeof this.state.letters_map[ix] !== 'undefined'){
        line_width += this.state.letters_map[ix].width;

        if (line_width >= this.width) {
          line_width = this.state.letters_map[ix].width;
          line_num++;
        }

        if(typeof glyph_lines[line_num] === 'undefined'){
          glyph_lines[line_num] = [];
        }
        
        glyph_lines[line_num].push(this.state.letters_map[ix]);

      }
    });

    return (
      <div className="RongoWrapper">
        {
          glyph_lines.map( (line, ix) => {
            return <GlyphLine key={ix} line_num={ix} glyph_line={line} />
          })
        }
      </div>
    )
  }
}




class GlyphLine extends React.Component{


  constructor(props){
    super(props);
    this.classes = "Glyphline " + (props.line_num % 2 === 0 ? 'line-f' : 'line-r');
  }

  render(){

    return (
      <div className={this.classes} >
      {
        this.props.glyph_line.map((letter, ix) => {
          return (
            <Glyph
              key={ix}
              paths={letter.paths}
              width={letter.width}
            />
          )
        })
      }
      </div>
    )
  }
}

class Glyph extends React.Component{

  state = {
    paths: [],
    width: 0
  };
  
  render(){
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 "+ this.props.width + " 120"} height="120" width={this.props.width}>
      {
        this.props.paths.map( (path, ix) => {
          return <path key={ix} d={path.path} transform={'translate(' + path.translate + ')'} />
        })
      }
      </svg>
    )
  }
}

class MD5MD5 extends React.Component{

  constructor() {
    super();
    this.state = {
      text: '',
      response_paths: []
    }
    
  }

  handleChange (event) {


    let textstate = event.target.value.replace(/[^A-Ya-y]/, '');
    this.setState( { text : textstate } );
    
  }

  handleKeyPress = (event) => {
    if(
      event.key === 'z' ||
      event.key === 'Z' ||
      event.key === '' ||
      event.key === ' ' ||
      event.key === 'Enter'
      ){
        fetch('http://1bc29b36f623ba82aaf6724fd3b16718.com/api/path.php', {
          method: "POST",
          body: JSON.stringify({password: this.state.text})
        })
          .then( function( response )  { return response.json(); })
          .then( ( r ) => { 
            if(r && typeof r.response !== 'undefined'){
              this.setState({response_paths : r.response})
            }
        })
        .catch(( error ) => { console.error(error); });
        
      }
    
  }
  componentDidMount(){

    fetch('http://1bc29b36f623ba82aaf6724fd3b16718.com/api/path.php', {
          method: "POST",
          body: JSON.stringify({password: this.state.text})
        })
          .then( function( response )  { return response.json(); })
          .then( ( r ) => { 
            if(r && typeof r.response !== 'undefined'){
              this.setState({response_paths : r.response})
            }
        })
    .catch(( error ) => { console.error(error); });
    
    this.setState({response_text : this.state.response_paths})

  }

  render() {
    return (
	    <div className="text">
        <ResponseText paths={this.state.response_paths} containerWidth={this.props.containerWidth}></ResponseText>
        <EnglishText text={this.state.text} handleKeyPress={(event) => this.handleKeyPress(event)} handleChange={ (text) => this.handleChange(text) }></EnglishText>
        <GlyphText text={this.state.text} containerWidth={this.props.containerWidth}></GlyphText>
      </div>
	  );
  }
}

ReactDOM.render(
  <MD5MD5 />,
  document.getElementById('root')
);
