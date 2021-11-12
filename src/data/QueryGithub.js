
import {
  gql
} from "@apollo/client";

export const QUERY = gql`
query{
    user(login: "JeRimes") {
    login
    avatarUrl
    company
    location
    bio
    name
    following {
        totalCount
      }
      followers {
          totalCount
      }
      commitComments {
        totalCount
      }
    repositories(first: 100) {
        nodes {
            #get all language used
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
          #get loc per language
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
`;