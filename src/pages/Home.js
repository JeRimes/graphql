import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import DivTotalActivity from '../components/TotalActivityGit'
import { Overview, Language, Repository} from '../components/Overview';
const QUERY = gql`
query{
    user(login: "JeRimes") {
    login
    avatarUrl
  }
}
`;



function Home() {
  const { loading, error, data } = useQuery(QUERY);

  if (loading) return <p>loading</p>;
  if (error) return <p>error</p>;
  console.log(data);
  return (
    <div className="content">
      <h1>{data.user.login}</h1>
      <p>{data.user.bio}</p>
      <DivTotalActivity />
      <Overview></Overview>
      <Language></Language>
      <Repository></Repository>
    </div>

  )
}

export default Home;