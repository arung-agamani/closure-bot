/* eslint-disable react/prop-types */
import React from 'react';
import { Table } from 'arwes';

interface PlaylistItem {
  id: string;
  name: string;
}

interface Props {
  playlists: Array<PlaylistItem>;
}

const ListPlaylist: React.FC<Props> = ({ playlists }) => {
  return (
    <Table
      className="font-arwes"
      animate
      headers={['No', 'Playlist Name']}
      dataset={playlists.map((entry, index) => {
        return [index, entry.name];
      })}
    />
  );
};

export default ListPlaylist;
