import React from 'react';
import {
    useQuery,
    gql
} from "@apollo/client";
import {allLanguageProg} from '../allProgramingLanguage.js';

import { Bar } from 'react-chartjs-2';

export var LOC = 0;
const QUERY = gql`
{

    user(login: "JeRimes") {
    login
    repositories(first: 100) {
      nodes {
        object(expression: "HEAD:") {
        ... on Tree {
          entries {
            name
            object {
              ... on Blob {
                byteSize
              }
              ... on Tree {
                entries {
                  name
                  object {
                    ... on Blob {
                      byteSize
                    }
                  }
                  extension
                }
              }
            }
          }
        }
      }
      }
    }
  
}
}
`
export function DivLOCperLanguage() {

    const { loading, error, data } = useQuery(QUERY);
    if (loading) return <p>loading</p>;
    if (error) return <p>error</p>;
    // const GetNodes = data.repository.object.entries;
    const GetNodes = data.user.repositories.nodes;
    
    var AllInfo = [];
    GetNodes.map((element)=>{
      if(element.object.entries!==undefined){
          element.object.entries.map((e)=>{
            if(e.object.entries!==undefined){
            e.object.entries.map((language)=>{
                 //get language per extension
                allLanguageProg.map(element=>{
                  if(element.extensions !== undefined){
                    element.extensions.map(ext=>{
                      if(ext=== language.extension  && language.object.byteSize > 0){
                        var nameLang = element.name;
                        AllInfo.push({lang: nameLang, biteSize : language.object.byteSize});
                      }
                    })
                  }
                });

            });
          }

        });
      }
    });

    const resp = AllInfo.reduce((lang, ele) => {
      const existingLang = lang.find(x => x.lang === ele.lang);
      if(!existingLang) return lang.concat(ele);
      return (existingLang.biteSize += ele.biteSize, lang);
    },[])
    resp.map(element=>{
      LOC+= element.biteSize;
    });
    console.log(LOC);
    var infoGraph = GetInfoGraph(resp.sort((a, b) => (a.biteSize > b.biteSize) ? 1 : -1));
    return(
        <div>
            <h1>Overview</h1>
            <p>For all repositories</p>
            <Bar data={infoGraph}/>
        </div>
    )
}

//return list attributes for graph
function GetInfoGraph(array){
  var infoGraph ={
    labels: [],
    datasets: []
  };
  
  array.map((x,i)=>{
    infoGraph.labels.push(x.lang);
  });
  
  infoGraph.datasets.push(
    {
      label:"LOC per language",
      data: array.map(a => a.biteSize),
      backgroundColor: 'red',
      borderColor: 'red',
    }
  )
  return infoGraph;
}