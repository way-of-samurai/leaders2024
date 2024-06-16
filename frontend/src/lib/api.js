import { unstable_noStore as noStore } from "next/cache"

export const generate = async (
  token,
  { prompt, width, height, client_id, product_features },
) => {
  noStore()

  const resp = await fetch(`${process.env.API_URL}/recommendations/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      prompt: prompt,
      xy: `${width}:${height}`,
      client_id: client_id,
      product_features: product_features,
    }),
  })
  console.log(resp)

  if (!resp.ok) {
    return null
  }

  const data = await resp.json()

  return {
    url: data.path.replace("s3:/", ""),
  }
}

export const currentUser = async (token) => {
  noStore()

  const resp = await fetch(`${process.env.API_URL}/current_user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!resp.ok) {
    console.log(resp)
    return null
  }

  const data = await resp.json()

  return {
    username: data.login,
    role: data.role?.toLowerCase(),
  }
}

export const login = async ({ username, password }) => {
  noStore()

  const resp = await fetch(`${process.env.API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: username,
      password: password,
    }),
  })

  if (!resp.ok) {
    console.log(resp)
    return null
  }

  const data = await resp.json()

  return {
    token: data.access_token,
  }
}

export const getClients = async (token) => {
  noStore()

  const resp = await fetch(`${process.env.API_URL}/clients`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!resp.ok) {
    console.log(resp)
    return null
  }

  const data = await resp.json()

  return data.map((client) => ({
    id: client.id,
    name: client.name,
    features: client.features || {},
  }))
}

export const setClient = async (token, body) => {
  noStore()

  const resp = await fetch(`${process.env.API_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (!resp.ok) {
    console.log(resp)
    return null
  }

  const data = await resp.json()

  return {
    id: data.id,
    name: data.name,
    features: data.features || {},
  }
}

export const deleteClient = async (token, id) => {
  noStore()

  const resp = await fetch(`${process.env.API_URL}/clients/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!resp.ok) {
    console.log(resp)
    return null
  }

  return {}
}
