export const returnFloat = (num: number) => {
	let value = Math.round(parseFloat(num) * 100) / 100;
	let xsd = value.toString().split('.');
	if (xsd.length === 1) {
		value = `${value.toString()}.00`;
		return value;
	}
	if (xsd.length > 1) {
		if (xsd[1].length < 2) {
			value = `${value.toString()}0`;
		}
		return value;
	}
};

export const getTWToday = () => {
	let westDate = new Date().toISOString().substring(0, 10);
	let twYear = parseInt(westDate.substring(0, 4)) - 1911;
	return twYear + westDate.split('-')[1] + westDate.split('-')[2];
};
