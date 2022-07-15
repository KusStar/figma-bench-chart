const { widget } = figma
const { useEffect, Text, AutoLayout, Rectangle, Line, useSyncedState, Fragment } = widget

const showMenu = () => new Promise((resolve) => {
  figma.showUI(__html__)
})

const Space = ({
  width = 20,
  height = 20,
  ...rest
}: {
  width?: number
  height?: number
}) => <Rectangle width={width} height={height} {...rest} />

const HBar = ({
  width = 100,
  height = 20,
  label = 'Label',
  barColor = '#000000',
}: {
  label?: string
  width?: number
  height?: number
  barColor?: string
}) => {
  return (
    <AutoLayout verticalAlignItems="center" horizontalAlignItems="center">
      <Text>
        {label}
      </Text>
      <Space />
      <Rectangle
        width={width}
        height={height}
        fill={barColor}
        cornerRadius={4}
      />
    </AutoLayout>
  )
}

function Widget() {
  const [bars, setBars] = useSyncedState("bars", [])

  useEffect(() => {
    figma.ui.onmessage = (msg) => {
      if (msg.type === 'showToast') {
        figma.notify('Hello widget')
      }
      if (msg.type === 'close') {
        figma.closePlugin()
      }
      if (msg.type === 'addBar') {
        setBars([...bars, msg.type])
      }
      if (msg.type === 'removeBar') {
        setBars(bars.slice(0, -1))
      }
    }
  })

  return (
    <AutoLayout direction="vertical" padding={12}
      onClick={showMenu}
    >
      {bars.length > 0 ?
        bars.map((bar, index) => (
          <Fragment>
            <HBar label="npm " barColor={"#000000"} />
            {index != bars.length - 1 && <Space />}
          </Fragment>
        ))
        :
        <Text>Open UI to add</Text>
      }

    </AutoLayout>
  )
}

widget.register(Widget)
