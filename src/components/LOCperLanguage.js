import React from 'react';
import {
  useQuery,
} from "@apollo/client";
import { allLanguageProg } from '../data/allProgramingLanguage.js';
import { Bar } from 'react-chartjs-2';
import { QUERY } from '../data/QueryGithub.js';
export var LOC = 0;

export function DivLOCperLanguage() {

  const { loading, error, data } = useQuery(QUERY);
  if (loading) return <p>loading</p>;
  if (error) return <p>error</p>;
  // const GetNodes = data.repository.object.entries;
  const GetNodes = data.user.repositories.nodes;

  var AllInfo = [];
  GetNodes.map((element) => {

    if (element.object.entries !== undefined) {
      element.object.entries.map((e) => {
        if (e.object.entries !== undefined) {
          e.object.entries.map((language) => {
            //get language per extension
            allLanguageProg.map(element => {
              if (element.extensions !== undefined) {
                element.extensions.map(ext => {

                  if (ext === language.extension && language.object.byteSize > 0) {
                    var nameLang = element.name;
                    AllInfo.push({ lang: nameLang, biteSize: language.object.byteSize });
                  }
                  return (ext);
                })
              }
              return (element);
            });
            return (language);
          });

        }
        return (e);
      });
    }
    return (element);
  });

  const resp = AllInfo.reduce((lang, ele) => {
    const existingLang = lang.find(x => x.lang === ele.lang);
    if (!existingLang) return lang.concat(ele);
    return (existingLang.biteSize += ele.biteSize, lang);
  }, [])
  resp.map(element => {
    LOC += element.biteSize;
    return element;
  });
  var infoGraph = GetInfoGraph(resp.sort((a, b) => (a.biteSize > b.biteSize) ? 1 : -1));
  return (
    <div>
      <h1>Overview</h1>
      <p>For all repositories</p>
      <Bar data={infoGraph} />
    </div>
  )
}

//return list attributes for graph
function GetInfoGraph(array) {
  var infoGraph = {
    labels: [],
    datasets: []
  };

  array.map((x, i) => {
    infoGraph.labels.push(x.lang);
    return x;
  });

  infoGraph.datasets.push(
    {
      label: "LOC per language",
      data: array.map(a => a.biteSize),
      backgroundColor: 'red',
      borderColor: 'red',
    }
  )
  return infoGraph;
}