// import React, { useEffect, useState } from 'react';
import React, { ComponentType } from 'react';

import { ResponsiveContainer, LineChart, Line, BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend, } from 'recharts';

// import * as Babel from '@babel/standalone';

import JsxParser from 'react-jsx-parser'

// import ReactJSXParser from 'react-jsx-parser';

import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';


const DynamicChart = ({ data, xkey, ykey }) => {
    let RechartsComponent = null;
    // console.log("code type of", code)
    console.log("data", data)
    console.log("xkey", xkey)
    console.log("ykey", ykey)


//   const scope = {
//     ResponsiveContainer,
//     LineChart,
//     Line,
//     BarChart,
//     Bar,
//     PieChart,
//     Pie,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     data,
//   };


//   const wrappedCode = `
//     (function() {
//       return (
//         ${code}
//       );
//     })()
//   `;
//   const wrappedCode = `
//     (() => {
//         return (
//         ${code}
//         );
//     })()
//     `;
//   const wrappedCode = `
//     () => (
//         ${code}
//     )
//     `;
//   const wrappedCode = `render(${code})`;

//   console.log("wrappedCode:", wrappedCode);

//   return (
//     <LiveProvider code={code} scope={scope} >
//       <LiveEditor />
//       <LiveError />
//       <LivePreview />
//     </LiveProvider>
//   );

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
//       <JsxParser
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

    const handleError = (error: Error) => {
        console.error('Error rendering JSX:', error);
        // You can add additional error handling logic here
    };

    return (
        
        <ResponsiveContainer width="90%" height={200}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="" />
                <XAxis dataKey={xkey} tick={{ fontSize: 8 }} tickCount={data.length} interval={0}/>
                <YAxis dataKey={ykey} />
                <Tooltip />
                {/* <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} /> */}
                <Line
                    type="monotone"
                    dataKey={ykey}
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
            </LineChart>
                {/* <JsxParser
                components={{ 
                LineChart,
                Line,
                XAxis,
                YAxis,
                CartesianGrid,
                Tooltip,
                Legend,
                ResponsiveContainer }}
                bindings={{data: data}}
                // jsx={code}
                jsx={'<h1>yay</h1>'}
                showWarnings={true}
                onError={handleError}
            /> */}
        </ResponsiveContainer>  
    );
};

export default DynamicChart;

// const components = {
//     ResponsiveContainer,
//     LineChart,
//     Line,
//     BarChart,
//     Bar,
//     PieChart,
//     Pie,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//   };

// const DynamicChart = ({ code, data }) => {
//     const [Component, setComponent] = useState(null);
  
//     useEffect(() => {
//       try {
//         const transformedCode = Babel.transform(
//           `
//             (function() {
//               const { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, data } = this;
//               return (
//                 ${code}
//               );
//             })();
//           `,
//           { presets: ['react'] }
//         ).code;
  
//         const ComponentFunc = new Function('React', ...Object.keys(components), 'data', `return ${transformedCode}`);
//         setComponent(() => ComponentFunc(React, ...Object.values(components), data));
//       } catch (error) {
//         console.error('Error compiling JSX:', error);
//       }
//     }, [code, data]);
  
//     return (
//       <ResponsiveContainer width="100%" height={400}>
//         {Component}
//       </ResponsiveContainer>
//     );
//   };
  
//   export default DynamicChart;