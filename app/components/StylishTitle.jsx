import StylishSpan from "./StylishSpan";

const StylishTitle = ({colored, simple, addBr, className = '', tagName = 'h1', fontSize = '5xl'}) => {
  
  const Tag = tagName;

  return (
    <Tag className={`text-${fontSize} my-10 leading-tight ${className}`}>
      {colored && (
        <StylishSpan>{colored}</StylishSpan>
      )} {addBr && <br />} {simple}
    </Tag>
  );
};

export default StylishTitle;
