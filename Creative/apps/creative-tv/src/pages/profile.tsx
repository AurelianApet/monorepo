import React from 'react'
import { useRouter } from 'next/router'
import request from 'graphql-request'
import { NextSeo } from 'next-seo'
import { BreadcrumbItem, BreadcrumbLink, Breadcrumb, Box } from '@chakra-ui/react'
import UserProfile from '../components/UserProfile'
import { siwe } from '../siwe'
import { GetServerSideProps } from 'next'
import { LOCK_ADDRESS_CREATIVE_TV, UNLOCK_QUERY_HOLDS_KEY, UNLOCK_API_URL } from '../utils/config'

export const walletHasToken = async (lockAddresses: string[], walletAddress: string) => {
  const fan = await request(UNLOCK_API_URL, UNLOCK_QUERY_HOLDS_KEY, { lockAddresses, walletAddress })
  return fan.keys.length > 0 // If the user has a key, they have the token
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { address } = await siwe.getSession(req, res)
  if (!address) {
    return {
      redirect: {
        permanent: false,
        destination: '/', // Redirect if wallet does not have the required token
      },
    }
  }
  const locks = [ LOCK_ADDRESS_CREATIVE_TV.creator, LOCK_ADDRESS_CREATIVE_TV.brand ]
  const tokenHolder = await walletHasToken(locks, address)
  if (!tokenHolder) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized', // Redirect if wallet does not have the required token
      },
    }
  }

  return {
    props: {},
  }
}

export default function profile() {
  const router = useRouter()
  return (
    <>
      <NextSeo title="Profile" />
      <Box p={4}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => router.push('/')}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink onClick={() => router.push('/profile')}>Member Profile</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <Box>
        <UserProfile />
      </Box>
    </>
  )
}