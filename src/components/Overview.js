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
  user(login: "JeRimes") {
    login
    repositories(first: 10) {

      totalCount

      #get language used
      nodes {
        languages(first: 10) {
          nodes {
            name
            color
          }
        }

      #repo name /with owner
      name
      nameWithOwner
      description

      #get number in team
      collaborators {
        totalCount
      }

      #get number of commit per repo
      defaultBranchRef {
        target {
          ... on Commit {
            id
            history(first: 0) {
              totalCount
            }
          }
        }
      }  


      }
    }
  }
}`;


export function Repository() {
    //Query to get language used in repo
    const { loading, error, data } = useQuery(QUERY);
    if (loading) return <p>loading</p>;
    if (error) return <p>error</p>;
    const GetNodes = data.user.repositories.nodes;
    var ListRepo =[];
    GetNodes.map((item, i) => {   
      var ListAttributes =[];
      const GetLanguage = item.languages.nodes;
      if(GetLanguage.length === 0){
          var myobj ={name : "Unatributes", color : "grey", counter: 0, itemWithOwner: item.nameWithOwner};
          ListAttributes.push(myobj);
      }
      //Add all language and other parameter
      GetLanguage.map((x, i) => {  
          var myobj = {name : x.name, color : x.color, counter: 0, itemWithOwner: item.nameWithOwner};
          ListAttributes.push(myobj);
      });
      ListRepo.push({ListAttr:ListAttributes, nameRepo:item.name, repoDesc:item.description, itemWithOwner:item.nameWithOwner, team : item.collaborators.totalCount, nbCommit: item.defaultBranchRef.target.history.totalCount});
    }
  );
  return (
    <div>
    <h1>Repository</h1>
    <p>{ListRepo.length} repos</p>
    <div className="repo-header bg-grey">
      <h3>#</h3>
      <h3>Repository</h3>
      <h3>Commits</h3>
      <h3>Team</h3>
      <h3>Language</h3>
    </div>
    <div>
    {
              ListRepo.map((repo, i) => (
              <div className="repo-content">
                      <div className="bg-soft-grey repo-language">
                        <div className="repo-firstLine">
                            <p>{i}</p>
                            <div className="repo-info">
                          
                              <p>{repo.nameRepo}</p>
                              <p>{repo.repoDesc}</p>
                        
                              <p>{repo.itemWithOwner}</p>

                              <div className="repo-language-container">
                                {
                                  repo.ListAttr.map((language, i) => (
                                    <div className="repo-language-card bg-grey">
                                        <p>{language.name}</p>
                                     
                                    </div>
                                          
                                  ))
                                  }
                                  </div>
                                  <div>
                              
                                    <p>{data.user.login}</p>
                                  </div>
                            </div>
                            <p>{repo.nbCommit}</p>
                            <p>{repo.team}</p>
                            <p>{repo.ListAttr.find(x=>x!==undefined).name}</p>
                        </div>
                          
                      </div>
              </div>
               ))
              }

    </div>
    </div>
    
    )

}

export function Language() {
  console.log("test");
  //Query to get language used in repo
  const { loading, error, data } = useQuery(QUERY);
  if (loading) return <p>loading</p>;
  if (error) return <p>error</p>;
    //path to language
    const GetNodes = data.user.repositories.nodes;

    //list with attributes : name of languge, color, occurence 
    var ListAttributes= getListAllAttributesLanguage(GetNodes);

    //distinct and unique name with all altributes : color and counter
    const unique = [...new Map(ListAttributes.map(item => [item["name"], item])).values()]
  console.log(unique);
    //sort list
    unique.sort((a, b) => (a.counter > b.counter) ? 1 : -1);

var infoGraph = GetInfoGraphDoughnut(unique);
  return (
    <div>
      <h1>Language</h1>
      <p>All language used in each repositories</p>
      <div className="LanguageBlock">
        <div className="content-language">
            {
              unique.map((language, i) => (
              <div className="card-language">
                      <div className="bg-soft-grey">
                        <h2>{language.name}</h2>
                      </div>
                      {/* <div className="bg-grey">
                      <p>Commits:</p>
                      <p>2</p>
                      </div>*/}
                      <div className="bg-soft-grey">
                        <p>Appear in {language.counter} repo</p>
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
      backgroundColor: array.map(a => a.color),
      borderWidth: 1,
    }
  )
  return infoGraph;
}

//Stock some data in array
function getListAllAttributesLanguage(GetNodes){
  var ListAttributes =[];
  GetNodes.map((item, i) => {   
    const GetLanguage = item.languages.nodes;
    if(GetLanguage.length === 0){
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