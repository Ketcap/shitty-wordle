import Head from "next/head"
import React, { FC } from "react"
import { BlitzLayout } from "@blitzjs/next"
import { styled } from "../components/stitches"

const Body = styled("div", {
  background: "#1D1F25",
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
})

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title || "wordle"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Body>{children}</Body>
    </>
  )
}

export default Layout
