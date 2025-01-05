import "./App.css";
import axios from "axios";
import { currencies } from "./currencies";
import { useEffect, useState } from "react";
function App() {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [amount, setAmount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [conversionHistory, setConversionHistory] = useState([]);
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setConversionHistory(savedHistory);
  }, []);
  const savedHistory = (entry) => {
    const updatedHistory = [entry, ...conversionHistory];
    setConversionHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
  };
  const convertCurrency = async () => {
    if (!selectedCurrency) {
      alert("Please select a currency to convert to.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    try {
      const { data } = await axios.get(
        `http://localhost:4000/convert?base_currency=${baseCurrency}&currencies=${selectedCurrency}`
      );
      console.log(data); 
      const rates = data.rates || {}; 
      const result = rates[selectedCurrency] * amount; // Adjust key if necessary
      const roundoffResult = parseFloat(result).toFixed(2);
  
      const countryCode = currencies.find(
        (currency) => currency.code === selectedCurrency
      );
      if (countryCode) {
        savedHistory({
          result: roundoffResult,
          flag: countryCode.flag.toLowerCase(),
          symbol: countryCode.symbol,
          code: countryCode.code,
          countryName: countryCode.name,
          date: new Date().toLocaleString(),
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error fetching conversion rate: ${error.message}`);
    }
  };
  

  const deleteHistoryItem = (index) => {
    const updatedHistory = conversionHistory.filter((_, i) => i !== index);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setConversionHistory(updatedHistory);
  };

  return (
    <div className="h-screen bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-end p-5 md:px-20">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-width[400px] h-full overflow-hidden">
        <h1 className="text-3xl font-bold text-grey-800 mb-7 overflow-hidden">
          Currency Converter
        </h1>
        <div className="mb-4 px-1">
          <label className="block text-gray-800 ">Base currency</label>
          <select
            className="w-full border-green-700 bg-gray-400  font-semibold text-xl rounded-lg p-1 my-1"
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
          >
            {currencies.map((element) => {
              return (
                <option key={element.code} value={element.code}>
                  {element.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mb-4 px-1">
          <label className="block text-gray-800 ">Amount</label>
          <input
            type="number"
            className="w-full border-green-700 bg-gray-400  font-semibold text-xl rounded-lg p-1 my-1"
            value={amount}
              onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-green-600 text-white p-3 
          rounded-lg font-semibold text-xl w-52 transition-all 
          duration-300 hover:bg-red-500"
            onClick={convertCurrency}
          >
            Convert
          </button>
        </div>
        <div className="mb-4 px-1">
          <label className="block text-gray-800 ">currency to convert</label>
          <select
            className="w-full border-green-700 bg-gray-400  font-semibold text-xl rounded-lg p-1 my-1"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            {currencies.map((element) => {
              return (
                <option key={element.code} value={element.code}>
                  {element.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mt-6 px-1">
          <h2 className="text-2xl  px-1 font-bold text-gray-800 mb-4">
            Conversion History
          </h2>
        </div>
        <div className="pd-1 h-[400px]">
          <ul className="pd-1">
            {conversionHistory.length > 0 ? (
              conversionHistory.map((element, index) => {
                return (
                  <li
                    key={index}
                    className="text-gray-700 mb-4 flex items-center
justify-between"
                  >
                    <div className="flex items-center gap-5">
                    <img
  src={`https://flagcdn.com/w40/${element.flag}.png`}
  alt={`${element.countryName} flag`}
  className="w-11 h-11"
/>;

                      <p className="flex flex-col gap-1 text-gray-600 font-medium">
                        <span className="text-xl font-semibold text-black">
                          {element.symbol} {element.result}
                        </span>
                        <span>
                          {element.code} - {element.countryName}
                        </span>;
                      </p>
                    </div>
                    <span
                      className="text-gray-500 font-bold text-xl hover:cursor-pointer"
                      onClick={() => deleteHistoryItem(index)}
                    >
                      X
                    </span>
                  </li>
                );
              })
            ) : (
              <p className=" text-lg px-1 text-gray-500 font-semibold">
                conversion History is Empty
              </p>
            )}

        
  <div className=" bg-gradient-to-r from-pink-500 to-purple-600 flex flex-col justify-between items-center  mt-40">
    <p>@Achyut Adhikari</p>
  </div>

          </ul>
        </div>
      </div>
    </div>
  );
}



export default App;
