import { type CSSProperties } from 'react';

const firstName = 'Alex';
const lastName = 'Fernandez';

const favoriteGames = ['Elden Ring', 'Smash', 'Metal Gear'];
const isActive = false;

const address = {
  zipCode: 'ABC-123',
  country: 'Canadá',
};

const myStyles: CSSProperties = {
  backgroundColor: '#fafafa',
  borderRadius: 20,
  padding: 10,
  marginTop: 30,
};

export const MyAwesomeApp = () => {
  return (
    <>
      <h1 data-testid="first-name"> {firstName} </h1>
      <h3 data-testid="last-name"> {lastName} </h3>

      <p>{favoriteGames.join(', ')}</p>
      <p>{2 + 2}</p>

      <h1>{isActive ? 'Activo' : 'No activo'}</h1>

      <p style={myStyles}>{JSON.stringify(address)}</p>
    </>
  );
};

// export function MyAwesomeApp() {
//   return (
//     <>
//       <h1>Fernando</h1>
//       <h3>Herrera</h3>
//     </>
//   );
// }
