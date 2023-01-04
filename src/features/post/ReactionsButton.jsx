import React from 'react';
import { useDispatch } from 'react-redux';
import { reactionAdd } from './postSlice';

const reactionEmoji = {
  thumb: '👍',
  wow: '😮',
  heart: '❤️',
  rocket: '🚀',
  coffee: '☕'
}

const ReactionsButton = ({ post }) => {
  const dispatch = useDispatch();

  const reactionButtons = Object.entries(reactionEmoji).map(([name,emoji]) => (
    <button
      key={name}
      type='button'
      className='reactionButton'
      onClick={() => {
        dispatch( reactionAdd({
          postId: post.id,
          reactionName: name
          })
        )}
      }
    >
      {emoji} {post.reactions[name]}
    </button>
  ))
  return (
    <div>{ reactionButtons }</div>
  );
}

export default ReactionsButton;