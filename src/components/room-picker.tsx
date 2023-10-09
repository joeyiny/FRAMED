const RoomPicker = ({ games }: { games: unknown[] }) => {
  return (
    <div>
      <p className="font-bold text-lg">Pick a game:</p>
      {games.map((game, i) => (
        <div className="border my-2 border-zinc-600" key={i}>
          {game.id}
        </div>
      ))}
    </div>
  );
};
export default RoomPicker;
