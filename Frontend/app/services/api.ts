export async function loginUser(username: string, password: string) {
  const res = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  return res.json();
}

export async function getUserInfo(token: string) {
  const res = await fetch("http://localhost:8000/api/user-info", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
}