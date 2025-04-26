import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Divider,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
} from '@mui/material';
import { RootState } from '../store';
import { AppDispatch } from '../store';
import {
    fetchTemplates,
    fetchGdprTemplate,
    fetchKvkkTemplate,
    checkCompliance,
} from '../store/slices/complianceSlice';

const ComplianceRules: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { templates, gdprTemplate, kvkkTemplate, isLoading, checkResult, error } = useSelector(
        (state: RootState) => state.compliance
    );

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
    const [textToCheck, setTextToCheck] = useState('');
    const [checkDialogOpen, setCheckDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchTemplates());
        dispatch(fetchGdprTemplate());
        dispatch(fetchKvkkTemplate());
    }, [dispatch]);

    const handleViewRules = (templateId: number) => {
        setSelectedTemplate(templateId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTemplate(null);
    };

    const handleOpenCheckDialog = (templateId: number) => {
        setSelectedTemplate(templateId);
        setCheckDialogOpen(true);
    };

    const handleCloseCheckDialog = () => {
        setCheckDialogOpen(false);
        setTextToCheck('');
    };

    const handleCheckCompliance = async () => {
        if (selectedTemplate && textToCheck) {
            await dispatch(checkCompliance({ text: textToCheck, templateId: selectedTemplate }));
        }
    };

    const getTemplateById = (id: number) => {
        return templates.find(template => template.id === id) || null;
    };

    const getTemplateRules = (id: number) => {
        const template = getTemplateById(id);
        if (!template) {
            if (id === 1) return gdprTemplate?.rules || [];
            if (id === 2) return kvkkTemplate?.rules || [];
            return [];
        }
        return template.rules;
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Compliance Rules
            </Typography>

            {/* Compliance Check Tool */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Compliance Check Tool
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Check your text against compliance rules to ensure it meets regulatory requirements.
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Text to check"
                            placeholder="Enter text to check for compliance..."
                            value={textToCheck}
                            onChange={(e) => setTextToCheck(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            disabled={!textToCheck}
                            onClick={() => handleOpenCheckDialog(1)} // Default to GDPR
                        >
                            Check Compliance
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Preset Templates */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Preset Templates
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* GDPR Template */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                GDPR Compliance
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                European Union General Data Protection Regulation compliance rules
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Chip
                                    label="EU"
                                    color="primary"
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                <Chip
                                    label="Privacy"
                                    color="secondary"
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                            </Box>
                        </CardContent>
                        <Divider />
                        <CardActions>
                            <Button size="small" color="primary" onClick={() => handleViewRules(1)}>
                                View Rules
                            </Button>
                            <Button size="small" color="primary" onClick={() => handleOpenCheckDialog(1)}>
                                Check Text
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* KVKK Template */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                KVKK Compliance
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Turkish Personal Data Protection Law compliance rules
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Chip
                                    label="Turkey"
                                    color="primary"
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                <Chip
                                    label="Privacy"
                                    color="secondary"
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                            </Box>
                        </CardContent>
                        <Divider />
                        <CardActions>
                            <Button size="small" color="primary" onClick={() => handleViewRules(2)}>
                                View Rules
                            </Button>
                            <Button size="small" color="primary" onClick={() => handleOpenCheckDialog(2)}>
                                Check Text
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            {/* Custom Templates */}
            <Typography variant="h6" gutterBottom>
                Custom Templates
            </Typography>
            <Grid container spacing={3}>
                {templates.map((template) => (
                    <Grid item xs={12} md={6} key={template.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {template.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {template.description}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Chip
                                        label={template.category}
                                        color="primary"
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        label={`v${template.version}`}
                                        color="secondary"
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                </Box>
                            </CardContent>
                            <Divider />
                            <CardActions>
                                <Button size="small" color="primary" onClick={() => handleViewRules(template.id)}>
                                    View Rules
                                </Button>
                                <Button size="small" color="primary" onClick={() => handleOpenCheckDialog(template.id)}>
                                    Check Text
                                </Button>
                                <Button size="small" color="error">
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add New Template Button */}
            <Box sx={{ mt: 4 }}>
                <Button variant="contained" color="primary">
                    Create New Template
                </Button>
            </Box>

            {/* View Rules Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedTemplate === 1 ? 'GDPR Compliance Rules' : 
                     selectedTemplate === 2 ? 'KVKK Compliance Rules' : 
                     getTemplateById(selectedTemplate || 0)?.name || 'Compliance Rules'}
                </DialogTitle>
                <DialogContent dividers>
                    <List>
                        {selectedTemplate && getTemplateRules(selectedTemplate).map((rule, index) => (
                            <ListItem key={index} divider>
                                <ListItemText
                                    primary={rule.name}
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.secondary">
                                                {rule.description}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Type: {rule.rule_type}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Check Compliance Dialog */}
            <Dialog open={checkDialogOpen} onClose={handleCloseCheckDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    Check Compliance
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Text to check"
                        placeholder="Enter text to check for compliance..."
                        value={textToCheck}
                        onChange={(e) => setTextToCheck(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    {checkResult && (
                        <Box sx={{ mt: 2 }}>
                            <Chip 
                                label={checkResult.is_compliant ? "Compliant" : "Non-Compliant"} 
                                color={checkResult.is_compliant ? "success" : "error"}
                                sx={{ mb: 2 }}
                            />
                            
                            {!checkResult.is_compliant && (
                                <>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Suggestions:
                                    </Typography>
                                    <List>
                                        {checkResult.suggestions.map((suggestion: string, index: number) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={suggestion} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCheckDialog} color="secondary">
                        Close
                    </Button>
                    <Button 
                        onClick={handleCheckCompliance} 
                        color="primary"
                        disabled={isLoading || !textToCheck}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Check'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ComplianceRules; 