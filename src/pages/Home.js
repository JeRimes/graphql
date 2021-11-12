import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import DivTotalActivity from '../components/TotalActivityGit'
import { Language, Repository} from '../components/Overview';
import {DivLOCperLanguage} from '../components/LOCperLanguage';

const QUERY = gql`
query{
    user(login: "JeRimes") {
    login
    avatarUrl
    company
    location
    bio
  }
}
`;



function Home() {

  return (
    <div className="content">
      <Header />
      <DivTotalActivity />
      <DivLOCperLanguage/>
      <Language/>
      <Repository/>
    </div>

  )
}

function Header(){
  const { loading, error, data } = useQuery(QUERY);

  if (loading) return <p>loading</p>;
  if (error) return <p>error</p>;
  return(
    <div>
      <h1>{data.user.login}</h1>
      <p>{data.user.bio}</p>
      <p>{data.user.company}</p>
      <p>{data.user.location}</p>
    </div>
  )
}

export default Home;