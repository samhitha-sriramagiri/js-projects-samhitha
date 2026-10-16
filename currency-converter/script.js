const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from');
const toCurrency = document.getElementById('to');
const convertButton = document.querySelector('form');
const result = document.getElementById('result');
const errorMessage = document.getElementById('error');
const exchangeRateAPIKey = 'fabaa88739890b6f9c977659';

result.style.display = 'none';
errorMessage.style.display = 'none';
let countryList;

amountInput.addEventListener('focus', () => {
    amountInput.style.borderColor = '#555';
});

const fetchCountryList = async () => {
    try {
        const response = await fetch("https://api.restcountries.com/countries/v5?response_fields=names.common,names.native,names.official,currencies,flag.emoji&limit=100&offset=0&api-key=rc_live_813f9166e1e54a698d79321ba02b6560&pretty=1",);
        const data = await response.json();
        countryList = data.data.objects.map(country => {
            const currencyFirst = country.currencies?.[0];
            if (!currencyFirst) return null;
            const name = country.names.common;
            const flag = country.flag.emoji;
            const currency = `${currencyFirst.code} - ${currencyFirst.name}`;
            return { name, flag, currency };
        });
        countryList = countryList.filter(country => country != null);
        addCountries();
    } catch (error) {
        console.log(error);
    }
};

const addCountries = () => {
    countryList.forEach(country => {
        const optionFrom = document.createElement('option');
        optionFrom.innerText = `${country.flag} ${country.currency}`;
        optionFrom.setAttribute('value', country.currency.split(" - ")[0]);
        fromCurrency.appendChild(optionFrom);
        const optionTo = document.createElement('option');
        optionTo.innerText = `${country.flag} ${country.currency}`;
        optionTo.setAttribute('value', country.currency.split(" - ")[0]);
        toCurrency.appendChild(optionTo);
    });
};

fetchCountryList();

convertButton.addEventListener('submit', (event) => {
    event.preventDefault();
    result.style.display = 'none';
    errorMessage.style.display = 'none';
    const fromValue = fromCurrency.value;
    const toValue = toCurrency.value;
    const amountValue = amountInput.value;
    getExchangeRate(fromValue, toValue).then(({ success, data }) => {
        if (success) {
            const rate = data["conversion_rate"];
            result.innerText = `${amountValue} ${fromValue} = ${(amountValue * rate).toFixed(2)} ${toValue}`;
            result.style.display = "block";
        } else {
            errorMessage.innerText = data;
            errorMessage.style.display = "block";
        }
    });
})

const getExchangeRate = async (fromValue, toValue) => {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${exchangeRateAPIKey}/pair/${fromValue}/${toValue}`);
        const data = await response.json();
        if (!response.ok) return { success: false, data: "Failed to fetch" };
        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
}