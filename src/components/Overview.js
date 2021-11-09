import React, { Component } from 'react';
import {
    useQuery,
    gql
} from "@apollo/client";
import { Bar, Doughnut  } from 'react-chartjs-2';

/*
extraire les languages
*/
const QUERY = gql`{
  viewer {
    login
    repositories(first: 10) {
      totalCount
      nodes {
        languages(first: 10) {
          nodes {
            name
            color
          }
        }
      }
    }
  }
}`;


export function Overview() {
  //Query to get language used in repo
  const { loading, error, data } = useQuery(QUERY);
  if (loading) return <p>loading</p>;
  if (error) return <p>error</p>;

    //path to language
    const GetNodes = data.viewer.repositories.nodes;

    //list with attributes : name of languge, color, occurence 
    var ListAttributes= getListAllAttributesLanguage(GetNodes);

    //distinct and unique name with all altributes : color and counter
    const unique = [...new Map(ListAttributes.map(item => [item["name"], item])).values()]

    //sort list
    unique.sort((a, b) => (a.counter > b.counter) ? 1 : -1);

var infoGraph = GetInfoGraph(unique);
  return (
    <div>
      <h1>Overview</h1>
      <Bar data={infoGraph}/>
    </div>
  )
}

export function Language() {
  //Query to get language used in repo
  const { loading, error, data } = useQuery(QUERY);
  if (loading) return <p>loading</p>;
  if (error) return <p>error</p>;
  console.log(data);
    //path to language
    const GetNodes = data.viewer.repositories.nodes;

    //list with attributes : name of languge, color, occurence 
    var ListAttributes= getListAllAttributesLanguage(GetNodes);

    //distinct and unique name with all altributes : color and counter
    const unique = [...new Map(ListAttributes.map(item => [item["name"], item])).values()]

    //sort list
    unique.sort((a, b) => (a.counter > b.counter) ? 1 : -1);

var infoGraph = GetInfoGraphDoughnut(unique);
  return (
    <div>
      <h1>Language</h1>
      <div className="LanguageBlock">
        <div class="content-language">
            {
              unique.map((paragraph, i) => (
              <div className="card-language">
                      <div className="bg-soft-grey">
                        <h2>{paragraph.name}</h2>
                      </div>
                      <div className="bg-grey">
                      <p>Commits:</p>
                      <p>2</p>
                      </div>
                    <div className="bg-soft-grey">
                        <p>Loc</p>
                        <p>2</p>
                    </div>
              </div>
               ))
              }
        </div>
        <Doughnut data={infoGraph}/>
      </div>
    </div>
  )
}

//return list attributes for graph
function GetInfoGraphDoughnut(array){
  var infoGraph ={
    labels: [],
    datasets: []
  };
  
  array.map((x,i)=>{
    infoGraph.labels.push(x.name);
  });
  
  infoGraph.datasets.push(
    {
      label: "All language use",
      data: array.map(a => a.counter),
      // data:[12, 19, 3, 5, 2, 3],
      backgroundColor: array.map(a => a.color),
      // stack: "Stack 1",
      borderWidth: 1,
    }
  )
  return infoGraph;
}


//return list attributes for graph
function GetInfoGraph(array){
  var infoGraph ={
    labels: [],
    datasets: []
  };
  
  array.map((x,i)=>{
    infoGraph.labels.push(x.name);
  });
  
  infoGraph.datasets.push(
    {
      label:"All language use",
      data: array.map(a => a.counter),
      backgroundColor: array.map(a => a.color),
      borderColor: array.map(a => a.color),
    }
  )
  return infoGraph;
}

function getListAllAttributesLanguage(GetNodes){
  var ListAttributes =[];
  GetNodes.map((item, i) => {   
    const GetLanguage = item.languages.nodes;
    if(GetLanguage.length == 0){
        var myobj ={name : "Unatributes", color : "grey", counter: 0};
        ListAttributes.push(myobj);
    }
    GetLanguage.map((x, i) => {  
        var myobj = {name : x.name, color : x.color, counter: 0};
        ListAttributes.push(myobj);
    });
  }
);
  uniqueLanguageFromArray(ListAttributes);
  return ListAttributes;
}

//Count number of occurence by name
function uniqueLanguageFromArray(array){
  array.map((x, i) => {  
    var count = array.reduce(function(n, val) {
      return n + (val.name === x.name);
    }, 0);
    array[i].counter = [count];
  });

  return array;
}