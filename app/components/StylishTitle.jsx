import StylishSpan from "./StylishSpan";

const StylishTitle = ({colored, simple, addBr, className = '', tagName = 'h1', fontSize = '4xl md:text-5xl'}) => {
  
  const Tag = tagName;

  return (
    <Tag className={`font-semibold text-${fontSize} mt-16 my-10 md:my-12 leading-tight ${className}`}>
      {colored && (
        <StylishSpan>{colored}</StylishSpan>
      )} {addBr && <br />} {simple}
    </Tag>
  );
};

export default StylishTitle;
