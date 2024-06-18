import styled from 'styled-components';

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: string;
  height?: string;
  debug?: boolean;
};

export const TestContainer = (
  <div className="border border-solid border-red-600"></div>
);

const Container = styled.div<ContainerProps>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  ${({ debug }) =>
    debug &&
    `
    border:1px solid red;
    `}
`;

export default Container;
