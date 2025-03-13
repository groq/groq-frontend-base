export async function getWeather(
	latitude: string,
	longitude: string,
): Promise<string> {
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

		const data = await response.json();

		return JSON.stringify(data.current_weather);
	} catch (error) {
		return `Weather data is currently unavailable, error: ${error}`;
	}
}
