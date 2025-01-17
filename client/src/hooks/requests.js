const API_URL = "v1";

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  return await response.json();
  // TODO: Once API is ready.
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const launches = await response.json();
  return launches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(launch),
    });
  } catch (error) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });
  } catch (error) {
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
