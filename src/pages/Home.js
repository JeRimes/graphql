import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import DivTotalActivity from '../components/TotalActivityGit'
import { Overview, Language, Repository} from '../components/Overview';
import {DivLOCperLanguage} from '../components/LOCperLanguage';

const QUERY = gql`
query{
    user(login: "JeRimes") {
    login
    avatarUrl
    company
    location
  }
}
`;



function Home() {
  const { loading, error, data } = useQuery(QUERY);

  if (loading) return <p>loading</p>;
  if (error) return <p>error</p>;
  return (
    <div className="content">
      <h1>{data.user.login}</h1>
      <p>{data.user.bio}</p>
      <p>{data.user.company}</p>
      <p>{data.user.location}</p>
      <DivTotalActivity />
      <DivLOCperLanguage></DivLOCperLanguage>
      <Language></Language>
      <Repository></Repository>
    </div>

  )
}

export default Home;