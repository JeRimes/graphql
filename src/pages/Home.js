import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import DivTotalActivity from '../components/TotalActivityGit'
import DivOverview from '../components/TotalActivityGit'
const QUERY = gql`
query{
    user(login: "JeRimes") {
    login
    avatarUrl
    bio
    following {
      totalCount
    }
    name
    commitComments {
      totalCount
    }
    repositories {
      totalCount
    }
  }
}
`;


/*
extraire les languages
{
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
}

*/
function Home() {
  const { loading, error, data } = useQuery(QUERY);

  if (loading) return <p>loading</p>;
  if (error) return <p>error</p>;
  console.log(data);
  return (
    <div>

      <p>{data.user.login}</p>
      <p>{data.user.bio}</p>
      <DivTotalActivity />
      <DivOverview />
    </div>

  )
}

export default Home;