import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const BettingCard = ({ title, winText, price, digits = 1, showBox = false, gameName = "Dear Lottery" }) => {
  const { addToCart } = useCart();
  
  // Manage state for multiple rows
  const [rows, setRows] = useState([
    { id: 1, numbers: Array(digits).fill(''), qty: 1 },
    { id: 2, numbers: Array(digits).fill(''), qty: 1 },
    { id: 3, numbers: Array(digits).fill(''), qty: 1 },
  ]);

  const updateNumber = (rowIdx, digitIdx, val) => {
    if (val.length > 1 || !/^\d*$/.test(val)) return;
    const newRows = [...rows];
    newRows[rowIdx].numbers[digitIdx] = val;
    setRows(newRows);
    
    // Auto focus next input
    if (val && digitIdx < digits - 1) {
      const next = document.getElementById(`input-${title}-${rowIdx}-${digitIdx + 1}`);
      if (next) next.focus();
    }
  };

  const updateQty = (rowIdx, delta) => {
    const newRows = [...rows];
    newRows[rowIdx].qty = Math.max(1, newRows[rowIdx].qty + delta);
    setRows(newRows);
  };

  const handleAdd = (rowIdx) => {
    const row = rows[rowIdx];
    if (row.numbers.some(n => n === '')) {
      alert("Please enter all numbers");
      return;
    }
    
    addToCart({
      title: `${gameName} - ${title}`,
      num: row.numbers.join(''),
      qty: row.qty,
      price: parseFloat(price),
      board: digits === 1 ? 'A' : digits === 2 ? 'AB' : 'ABC'
    });

    // Clear the row
    const newRows = [...rows];
    newRows[rowIdx].numbers = Array(digits).fill('');
    setRows(newRows);
  };

  const handleRandom = (rowIdx) => {
    const newRows = [...rows];
    newRows[rowIdx].numbers = Array(digits).fill(0).map(() => Math.floor(Math.random() * 10).toString());
    setRows(newRows);
  };

  return (
    <div className="border-[1.5px] border-[#ff004d] rounded-2xl p-4 mb-6 bg-white shadow-xl relative overflow-hidden">
      <div className="flex gap-4 mb-5 border-b border-gray-100 pb-3">
        <img src="https://img.icons8.com/color/64/000000/treasure-chest.png" alt="Chest" className="w-14 h-14 drop-shadow-md" />
        <div className="flex-grow">
          <h3 className="text-gray-900 font-black text-lg leading-tight uppercase tracking-tight">
            {title} <span className="text-[#ff004d]">{winText}</span>
          </h3>
          <p className="text-[#ff004d] font-black text-xl">₹ {price}</p>
        </div>
        <button 
          onClick={() => rows.forEach((_, i) => handleRandom(i))}
          className="bg-gray-700 text-white text-[10px] px-3 py-1.5 rounded-lg h-fit font-black uppercase shadow-sm active:scale-95"
        >
          Random All
        </button>
      </div>

      <div className="space-y-5">
        {rows.map((row, rowIdx) => (
          <div key={row.id} className="flex items-center justify-between gap-2">
             <div className="flex gap-1 shrink-0">
                {['A', 'B', 'C', 'D'].slice(0, digits).map(label => (
                  <div key={label} className="w-8 h-8 bg-[#ff004d] rounded-full flex items-center justify-center text-white font-black text-[10px] shadow-md">{label}</div>
                ))}
             </div>
             
             <div className="flex gap-1 shrink-0">
                {row.numbers.map((num, digIdx) => (
                  <input 
                    key={digIdx}
                    id={`input-${title}-${rowIdx}-${digIdx}`}
                    type="text" 
                    value={num}
                    onChange={(e) => updateNumber(rowIdx, digIdx, e.target.value)}
                    className="w-8 h-8 border-[1.5px] border-gray-950 rounded-lg text-center text-lg font-black bg-white focus:border-[#ff004d] outline-none" 
                    placeholder="-" 
                  />
                ))}
             </div>

             <div className="flex items-center border-[1.5px] border-gray-700 rounded-lg overflow-hidden h-8 bg-gray-50">
                <button onClick={() => updateQty(rowIdx, -1)} className="bg-gray-600 text-white px-2 font-black text-lg hover:bg-gray-700 active:bg-gray-800">-</button>
                <div className="w-7 text-center font-black text-sm text-gray-900">{row.qty}</div>
                <button onClick={() => updateQty(rowIdx, 1)} className="bg-gray-600 text-white px-2 font-black text-lg hover:bg-gray-700 active:bg-gray-800">+</button>
             </div>

             <div className="flex gap-1 shrink-0">
                <button 
                  onClick={() => handleAdd(rowIdx)}
                  className="bg-[#ff004d] text-white px-3 py-2 rounded-lg font-black text-[10px] uppercase shadow-md active:scale-95"
                >
                  ADD
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BettingCard;
