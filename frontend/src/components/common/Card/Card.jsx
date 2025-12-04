/**
 * Card Component
 * Container component for content sections
 */

const Card = ({
  children,
  title,
  subtitle,
  footer,
  variant = 'default',
  padding = 'default',
  hoverable = false,
  onClick,
  className = '',
}) => {
  const baseStyles = 'bg-white rounded-lg transition-all duration-200';
  
  const variants = {
    default: 'border border-gray-200',
    elevated: 'shadow-soft hover:shadow-medium',
    outlined: 'border-2 border-gray-300',
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };
  
  const hoverStyles = hoverable ? 'cursor-pointer hover:shadow-medium hover:border-primary-300' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';
  
  const cardClasses = `${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${clickableStyles} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className={title || subtitle ? 'mt-4' : ''}>
        {children}
      </div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
