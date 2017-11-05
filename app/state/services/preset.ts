const baseUrl = 'http://localhost:8000/data/';

export default async (id) => {
  try {
    const response = await fetch(`${baseUrl}${id}`);
    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  } catch (error) {
    throw error;
  }
};
