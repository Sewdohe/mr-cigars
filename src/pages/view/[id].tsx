import React from 'react'
import Layout from '../../components/Layout'
import { Router } from "@reach/router"

interface Props {
  id: string
}

function ViewOrder (props: Props, id: string) {
  console.log(id)
  return (
    <Layout>
      <Router basepath="/app">
      </Router>
    </Layout>
  )
}

export default ViewOrder
