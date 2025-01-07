interface SegmentedControlItemProps {
  label: string
  value: string
  isActive?: boolean
  onClick: () => void
}

interface SegmentedControlProps {
  options: SegmentedControlItemProps[]
  activeValue: string
}

function SegmentedControlItem({ label, isActive, onClick }: SegmentedControlItemProps) {
  return (
    <button 
      className={`${isActive ? 'surface-03 text-01 font-medium' : 'text-02'} text-xs rounded-md px-2 py-1`} 
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default function SegmentedControl({ options, activeValue }: SegmentedControlProps) {
  return (
    <div className="flex gap-1 p-1 surface-01 rounded-md">
      {options.map((option, index) => (
        <SegmentedControlItem 
          key={index}
          label={option.label} 
          value={option.value} 
          isActive={option.value === activeValue} 
          onClick={option.onClick} 
        />
      ))}
    </div>
  )
}