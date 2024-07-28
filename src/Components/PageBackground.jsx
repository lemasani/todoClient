import PropTypes from 'prop-types';

export default function PageBackground({ children }) {
  return (
    <>
      <div className="bg-gradient-to-r from-gray-100 via-white to-gray-200 h-screen">
        <div className="h-screen">
          <div className="p-4 rounded-lg">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

PageBackground.propTypes = {
  children: PropTypes.node.isRequired,
};