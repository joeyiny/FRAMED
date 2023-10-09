const RoomPicker = ({ games }: { games: unknown[] }) => {
  return games.map((game, i) => <p key={i}>{game.id}</p>);
};
export default RoomPicker;
