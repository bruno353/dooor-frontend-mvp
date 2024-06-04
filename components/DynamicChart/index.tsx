import React from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend, } from 'recharts';
import ReactJSXParser from 'react-jsx-parser';
import Expr from 'react-expr';


const DynamicChart = ({ code, data }) => {
  let RechartsComponent = null;
  console.log("code type of", code)
  console.log("data", data)

//   try {
//     // Wrap the JSX code in a function call
//     const codeToExecute = `
//       (function() {
//         return (${code});
//       })()
//     `;
//     // Execute the function to get the React component
//     console.log("code to execute", codeToExecute);
//     RechartsComponent = eval(codeToExecute);
//     console.log("RechartsComponent", RechartsComponent)
//   } catch (e) {
//     console.error('Error executing Recharts code:', e);
//   }

//   try {
//     // Create a new function that returns the JSX
//     const codeFunction = new Function(
//       'React',
//       'ResponsiveContainer',
//       'LineChart',
//       'Line',
//       'BarChart',
//       'Bar',
//       'PieChart',
//       'Pie',
//       // Add other Recharts components as needed
//       `
//         return (${code});
//       `
//     );

//     // Execute the function to get the React component
//     RechartsComponent = codeFunction(
//       React,
//       ResponsiveContainer,
//       LineChart,
//       Line,
//       BarChart,
//       Bar,
//       PieChart,
//       Pie,
//       // Pass other Recharts components as needed
//     );
//     console.log("RechartsComponent", RechartsComponent);
//   } catch (e) {
//     console.error('Error executing Recharts code:', e);
//   }



//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <ReactJSXParser
//         components={{ LineChart, Line, BarChart,
//             Bar,
//             PieChart,
//             Pie,
//             XAxis,
//             YAxis,
//             CartesianGrid,
//             Tooltip,
//             Legend }}
//         jsx={code}
//       />
//     </ResponsiveContainer>
//   );
  return (
    <ResponsiveContainer width="100%" height={400}>
        {/* <LineChart>
            
        </LineChart> */}
      {/* <ReactJSXParser
        components={{ ResponsiveContainer, LineChart, Line, BarChart,
            Bar,
            PieChart,
            Pie,
            XAxis,
            YAxis,
            CartesianGrid,
            Tooltip,
            Legend, }}
        // bindings={{data: data}}
        jsx={code}
        renderInWrapper={false}
        autoCloseVoidElements={true}
        showWarnings={true}
        // jsx={'<h1>YAY</h1>'}
      /> */}
      <Expr
        components={{
          ResponsiveContainer,
          LineChart,
          Line,
          BarChart,
          Bar,
          PieChart,
          Pie,
          XAxis,
          YAxis,
          CartesianGrid,
          Tooltip,
          Legend,
        }}
        bindings={{ data }}
        expr={code}
      />
    </ResponsiveContainer>
  );
};

export default DynamicChart;
