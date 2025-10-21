import { Button, Container, Flex } from '@maxhub/max-ui'
function App() {
    return (
        <>
            <div>
                <Container>
                    <Flex
                        direction="column"
                        gap={12}
                    >
                        <Button
                            appearance="neutral"
                            mode="secondary"
                            size="large"
                            stretched
                        >
                            Допустим выплаты и льготы
                        </Button>
                        <Button
                            appearance="neutral"
                            mode="secondary"
                            size="large"
                            stretched
                        >
                            Что то еще
                        </Button>
                    </Flex>
                </Container>
            </div>
        </>
    )
}

export default App
