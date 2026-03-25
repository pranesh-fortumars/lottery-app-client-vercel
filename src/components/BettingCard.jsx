import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const BettingCard = ({ title, winText: initialWinText, price: initialPrice, digits = 1, gameName = "Dear Lottery", priceOptions = [], customRows = null }) => {
  const { addToCart } = useCart();
  const [selectedTier, setSelectedTier] = useState(priceOptions.length > 0 ? priceOptions[0] : null);
  
  const currentPrice = selectedTier ? selectedTier.price : initialPrice;
  const currentWinText = selectedTier ? `Win ${selectedTier.win}` : (initialWinText || "");

  // Local state for rows. Each row has its own data.
  const [rows, setRows] = useState(() => {
    if (customRows) {
      return customRows.map((config, idx) => ({
        id: idx + 1,
        numbers: Array(config.digits).fill(''),
        qty: 1,
        labels: config.labels
      }));
    }
    return [
      { id: 1, numbers: Array(digits).fill(''), qty: 1, labels: null },
      { id: 2, numbers: Array(digits).fill(''), qty: 1, labels: null },
      { id: 3, numbers: Array(digits).fill(''), qty: 1, labels: null },
    ];
  });

  const updateNumber = (rowIdx, digitIdx, val) => {
    if (val.length > 1 || !/^\d*$/.test(val)) return;
    const newRows = [...rows];
    newRows[rowIdx].numbers[digitIdx] = val;
    setRows(newRows);
    
    if (val && digitIdx < newRows[rowIdx].numbers.length - 1) {
      const next = document.getElementById(`input-${title}-${rowIdx}-${digitIdx + 1}`);
      if (next) next.focus();
    }
  };

  const updateQty = (rowIdx, delta) => {
    const newRows = [...rows];
    newRows[rowIdx].qty = Math.max(1, newRows[rowIdx].qty + delta);
    setRows(newRows);
  };

  const getPermutations = (arr) => {
    const results = [];
    const permute = (current, remaining) => {
      if (remaining.length === 0) {
        results.push(current.join(''));
        return;
      }
      for (let i = 0; i < remaining.length; i++) {
        permute([...current, remaining[i]], [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
      }
    };
    permute([], arr);
    return [...new Set(results)]; 
  };

  const handleBox = (rowIdx) => {
    const row = rows[rowIdx];
    if (row.numbers.some(n => n === '')) {
      alert("Please enter all 3 numbers for BOX");
      return;
    }
    
    const permutations = getPermutations(row.numbers);
    permutations.forEach(num => {
      addToCart({
        title: `${gameName} - ${title} (BOX) (Price: ${currentPrice})`,
        num: num,
        qty: row.qty,
        price: parseFloat(currentPrice),
        board: 'ABC'
      });
    });

    const newRows = [...rows];
    newRows[rowIdx].numbers = Array(row.numbers.length).fill('');
    setRows(newRows);
    alert(`Added ${permutations.length} combinations to cart!`);
  };

  const handleAdd = (rowIdx) => {
    const row = rows[rowIdx];
    if (row.numbers.some(n => n === '')) {
      alert("Please enter all numbers");
      return;
    }
    
    let boardLabel = '';
    if (row.labels) {
      boardLabel = row.labels.join('');
    } else {
      const d = row.numbers.length;
      if (d === 1) boardLabel = 'A';
      else if (d === 2) boardLabel = 'AB';
      else if (d === 3) boardLabel = 'ABC';
      else if (d === 4) boardLabel = 'DABC';
    }

    addToCart({
      title: `${gameName} - ${title} (Board: ${boardLabel})`,
      num: row.numbers.join(''),
      qty: row.qty,
      price: parseFloat(currentPrice),
      board: boardLabel
    });

    const newRows = [...rows];
    newRows[rowIdx].numbers = Array(row.numbers.length).fill('');
    setRows(newRows);
  };

  const handleRandom = (rowIdx) => {
    const newRows = [...rows];
    const d = newRows[rowIdx].numbers.length;
    newRows[rowIdx].numbers = Array(d).fill(0).map(() => Math.floor(Math.random() * 10).toString());
    setRows(newRows);
  };

  const getLabel = (row, idx) => {
    if (row.labels) return row.labels[idx];
    const d = row.numbers.length;
    if (d === 3) return ['A', 'B', 'C'][idx];
    if (d === 4) return ['D', 'A', 'B', 'C'][idx];
    return ['A', 'B', 'C', 'D'][idx];
  };

  return (
    <div className="border-[1.5px] border-[#ff004d] rounded-2xl p-4 mb-6 bg-white shadow-xl relative overflow-hidden">
      <div className="flex gap-4 mb-3 border-b border-gray-100 pb-3">
        <img src="https://img.icons8.com/color/64/000000/treasure-chest.png" alt="Chest" className="w-14 h-14 drop-shadow-md" />
        <div className="flex-grow">
          <h3 className="text-gray-900 font-black text-lg leading-tight uppercase tracking-tight">
            {title}
          </h3>
          <p className="text-[#ff004d] font-black text-[10px] uppercase tracking-tight leading-none mb-1">
            {currentWinText && (currentWinText.includes('Win ') ? currentWinText : `Win ${currentWinText}`)}
          </p>
          <p className="text-[#ff004d] font-black text-xl leading-none">₹ {currentPrice}</p>
        </div>
        <button 
          onClick={() => rows.forEach((_, i) => handleRandom(i))}
          className="bg-gray-700 text-white text-[10px] px-3 py-1.5 rounded-lg h-fit font-black uppercase shadow-sm active:scale-95 transition-transform"
        >
          Random All
        </button>
      </div>

      {priceOptions.length > 0 && (
        <div className="flex overflow-x-auto gap-2 mb-4 pb-2 scrollbar-hide">
          {priceOptions.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTier(opt)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${
                selectedTier?.price === opt.price 
                  ? 'bg-[#ff004d] text-white border-[#ff004d] shadow-md scale-105' 
                  : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300'
              }`}
            >
              ₹ {opt.price}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-5 overflow-x-auto pb-2 scrollbar-hide">
        {rows.map((row, rowIdx) => (
          <div key={row.id} className="flex items-center justify-between gap-3 min-w-[340px]">
             <div className="flex gap-1 shrink-0">
                {row.numbers.map((_, i) => (
                  <div key={i} className="w-7 h-7 bg-[#ff004d] rounded-full flex items-center justify-center text-white font-black text-[9px] shadow-sm uppercase">{getLabel(row, i)}</div>
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
                    maxLength="1"
                  />
                ))}
             </div>

             <div className="flex items-center border-[1.5px] border-gray-700 rounded-lg overflow-hidden h-8 bg-gray-50 shrink-0">
                <button onClick={() => updateQty(rowIdx, -1)} className="bg-gray-600 text-white px-2 font-black text-lg hover:bg-gray-700 active:bg-gray-800">-</button>
                <div className="w-6 text-center font-black text-sm text-gray-900">{row.qty}</div>
                <button onClick={() => updateQty(rowIdx, 1)} className="bg-gray-600 text-white px-2 font-black text-lg hover:bg-gray-700 active:bg-gray-800">+</button>
             </div>

             <div className="flex gap-1 shrink-0">
                {row.numbers.length === 3 && (
                   <button 
                     onClick={() => handleBox(rowIdx)}
                     className="bg-gray-800 text-white px-2 py-2 rounded-lg font-black text-[9px] uppercase shadow-md active:scale-95 border-b-4 border-gray-950"
                   >
                     BOX
                   </button>
                )}
                <button 
                  onClick={() => handleAdd(rowIdx)}
                  className="bg-[#ff004d] text-white px-3 py-2 rounded-lg font-black text-[9px] uppercase shadow-md active:scale-95 border-b-4 border-gray-950"
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
