import React from 'react'
import { Text, View } from 'react-native'
import { graphql } from 'react-relay'
import { useQuery } from 'relay-hooks'
import { EmailFragment } from './email-fragment'
import { UsernameFragment } from './username-fragment'

const QUERY_ME = graphql`
  query meComponentQuery {
    me {
      user {
        id
        ...usernameFragment_user
        ...emailFragment_user
      }
    }
  }
`

export function Me () {
  const { error, props } = useQuery({ query: QUERY_ME, variables: null })

  if (error) return <Text>{error[0] ? error[0].message : error.message}</Text>

  if (!props) return <Text>loading</Text>

  return (
    <View>
      <UsernameFragment {...props} />
      <EmailFragment {...props} />
    </View>
  )
}